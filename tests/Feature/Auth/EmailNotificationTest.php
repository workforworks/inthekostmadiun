<?php

use App\Mail\UserRegisteredMail;
use App\Models\User;
use App\Notifications\ResetPasswordNotification;

test('registration email content is properly formatted', function () {
    $user = User::factory()->make([
        'name' => 'Budi Santoso',
        'email' => 'budi@example.com',
    ]);

    $mailable = new UserRegisteredMail($user);
    $mailable->assertHasSubject('Registrasi Akun Berhasil - '.config('app.name', 'InTheKost Madiun'));
    $mailable->assertSeeInHtml('Budi Santoso');
    $mailable->assertSeeInHtml('budi@example.com');
    $mailable->assertSeeInHtml('Masuk ke Akun');
});

test('reset password notification mail content is properly formatted', function () {
    $user = User::factory()->make([
        'name' => 'Siti Rahma',
        'email' => 'siti@example.com',
    ]);

    $notification = new ResetPasswordNotification('sample-token-12345');
    $mailMessage = $notification->toMail($user);

    expect($mailMessage->subject)->toBe('Reset Password Akun Anda - '.config('app.name', 'InTheKost Madiun'));
    expect($mailMessage->viewData['userName'])->toBe('Siti Rahma');
    expect($mailMessage->viewData['resetUrl'])->toContain('reset-password/sample-token-12345');
    expect($mailMessage->viewData['count'])->toBe(60);
});
