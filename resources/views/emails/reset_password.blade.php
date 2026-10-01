@extends('emails.layout', ['title' => 'Reset Password Akun Anda'])

@section('content')
    <div class="greeting">Halo, {{ $userName ?? 'Pengguna' }}!</div>

    <p>Kami menerima permintaan untuk mengatur ulang kata sandi (reset password) akun Anda di <strong>{{ config('app.name', 'InTheKost Madiun') }}</strong>.</p>

    <p>Silakan klik tombol di bawah ini untuk membuat password baru:</p>

    <div class="btn-wrapper">
        <a href="{{ $resetUrl }}" class="btn" target="_blank">Reset Password</a>
    </div>

    <div class="badge-warning">
        <strong>Penting:</strong> Tautan pengaturan ulang kata sandi ini hanya berlaku selama <strong>{{ $count ?? config('auth.passwords.users.expire', 60) }} menit</strong> demi keamanan akun Anda.
    </div>

    <p>Jika Anda tidak pernah meminta perubahan password, Anda dapat mengabaikan email ini dengan aman. Akun dan kata sandi Anda tidak akan mengalami perubahan.</p>

    <div class="fallback-box">
        Jika Anda mengalami kendala saat mengeklik tombol "Reset Password", salin dan tempel tautan di bawah ini ke browser web Anda:<br>
        <a href="{{ $resetUrl }}" class="fallback-url">{{ $resetUrl }}</a>
    </div>
@endsection
