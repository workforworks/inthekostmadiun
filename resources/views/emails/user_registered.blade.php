@extends('emails.layout', ['title' => 'Registrasi Akun Berhasil'])

@section('content')
    <div class="greeting">Halo, {{ $user->name }}!</div>

    <p>Selamat datang di <strong>{{ config('app.name', 'InTheKost Madiun') }}</strong>. Akun Anda telah berhasil didaftarkan dan siap digunakan.</p>

    <div class="info-card">
        <div class="info-card-item">
            <span class="info-label">Nama Lengkap:</span>
            <span class="info-value">{{ $user->name }}</span>
        </div>
        <div class="info-card-item">
            <span class="info-label">Alamat Email:</span>
            <span class="info-value">{{ $user->email }}</span>
        </div>
        <div class="info-card-item">
            <span class="info-label">Tanggal Daftar:</span>
            <span class="info-value">{{ $user->created_at ? $user->created_at->translatedFormat('d F Y, H:i') . ' WIB' : date('d F Y, H:i') . ' WIB' }}</span>
        </div>
    </div>

    <p>Sekarang Anda dapat masuk ke platform untuk mulai mencari atau mengelola informasi kost terbaik di Madiun.</p>

    <div class="btn-wrapper">
        <a href="{{ $loginUrl }}" class="btn" target="_blank">Masuk ke Akun</a>
    </div>

    <div class="fallback-box">
        Jika tombol di atas tidak dapat diklik, salin dan tempel tautan berikut ke browser web Anda:<br>
        <a href="{{ $loginUrl }}" class="fallback-url">{{ $loginUrl }}</a>
    </div>
@endsection
