<?php

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;

test('reset password link screen can be rendered', function () {
    $response = $this->get('/forgot-password');

    $response->assertStatus(200);
});

test('reset password link can be requested for existing user', function () {
    Notification::fake();

    $user = User::factory()->create();

    $response = $this->post('/forgot-password', ['email' => $user->email]);

    $response->assertSessionHas('status', 'Jika email terdaftar, kami telah mengirimkan instruksi reset password.');
    Notification::assertSentTo($user, ResetPasswordNotification::class);
});

test('reset password request for non-existing email returns generic response without sending notification', function () {
    Notification::fake();

    $response = $this->post('/forgot-password', ['email' => 'unknown@example.com']);

    $response->assertSessionHas('status', 'Jika email terdaftar, kami telah mengirimkan instruksi reset password.');
    Notification::assertNothingSent();
});

test('reset password screen can be rendered', function () {
    Notification::fake();

    $user = User::factory()->create();

    $this->post('/forgot-password', ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPasswordNotification::class, function ($notification) {
        $response = $this->get('/reset-password/'.$notification->token);

        $response->assertStatus(200);

        return true;
    });
});

test('password can be reset with valid token and user can login with new password', function () {
    Notification::fake();

    $user = User::factory()->create([
        'password' => Hash::make('old-password'),
    ]);

    $this->post('/forgot-password', ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPasswordNotification::class, function ($notification) use ($user) {
        $response = $this->post('/reset-password', [
            'token' => $notification->token,
            'email' => $user->email,
            'password' => 'new-secure-password',
            'password_confirmation' => 'new-secure-password',
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('login'));

        $user->refresh();
        expect(Hash::check('new-secure-password', $user->password))->toBeTrue();
        expect(Hash::check('old-password', $user->password))->toBeFalse();

        // Check login with new password
        $loginResponse = $this->post('/login', [
            'email' => $user->email,
            'password' => 'new-secure-password',
        ]);
        $loginResponse->assertRedirect(route('dashboard', absolute: false));
        $this->assertAuthenticatedAs($user);

        return true;
    });
});

test('password cannot be reset with invalid token', function () {
    $user = User::factory()->create();

    $response = $this->post('/reset-password', [
        'token' => 'invalid-token-123456',
        'email' => $user->email,
        'password' => 'new-secure-password',
        'password_confirmation' => 'new-secure-password',
    ]);

    $response->assertSessionHasErrors('email');
});

test('token cannot be reused after password has already been reset', function () {
    Notification::fake();

    $user = User::factory()->create();

    $this->post('/forgot-password', ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPasswordNotification::class, function ($notification) use ($user) {
        // First reset
        $this->post('/reset-password', [
            'token' => $notification->token,
            'email' => $user->email,
            'password' => 'first-new-password',
            'password_confirmation' => 'first-new-password',
        ]);

        // Attempt second reset with same token
        $secondAttempt = $this->post('/reset-password', [
            'token' => $notification->token,
            'email' => $user->email,
            'password' => 'second-new-password',
            'password_confirmation' => 'second-new-password',
        ]);

        $secondAttempt->assertSessionHasErrors('email');

        return true;
    });
});
