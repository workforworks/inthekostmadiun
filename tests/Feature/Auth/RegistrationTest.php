<?php

use App\Mail\UserRegisteredMail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register and registration email is sent', function () {
    Mail::fake();

    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $user = User::where('email', 'test@example.com')->first();
    expect($user)->not->toBeNull();

    Mail::assertSent(UserRegisteredMail::class, function ($mail) use ($user) {
        return $mail->hasTo($user->email) && $mail->user->id === $user->id;
    });
});

test('registration email is not sent if registration validation fails', function () {
    Mail::fake();

    $response = $this->post('/register', [
        'name' => '',
        'email' => 'invalid-email',
        'password' => 'password',
        'password_confirmation' => 'different-password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors(['name', 'email', 'password']);

    Mail::assertNothingSent();
});
