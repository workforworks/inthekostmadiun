<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        try {
            Password::sendResetLink(
                $request->only('email')
            );
        } catch (Throwable $e) {
            Log::error('Gagal memproses pengiriman reset password link: '.$e->getMessage(), [
                'email' => $request->email,
            ]);
        }

        return back()->with('status', 'Jika email terdaftar, kami telah mengirimkan instruksi reset password.');
    }
}
