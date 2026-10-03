<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 1. PUBLIC LANDING PAGE
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {

    // 3. ADMIN AREA (Memakai Prefix URL)
    Route::prefix('admin')
        ->name('admin.')
        ->middleware('role:admin')
        ->group(function () {
            Route::get('/dashboard', function () {
                return Inertia::render('Admin/Dashboard');
            })->name('dashboard');

            // OWNER MANAGEMENT (ADM-008)
            Route::patch('owners/{owner}/toggle-status', [\App\Http\Controllers\Admin\OwnerController::class, 'toggleStatus'])->name('owners.toggle-status');
            Route::patch('owners/{owner}/verification', [\App\Http\Controllers\Admin\OwnerController::class, 'updateVerification'])->name('owners.update-verification');
            Route::patch('owners/{owner}/account-status', [\App\Http\Controllers\Admin\OwnerController::class, 'updateAccountStatus'])->name('owners.update-account-status');
            Route::resource('owners', \App\Http\Controllers\Admin\OwnerController::class)->only(['index', 'store']);

            // SURVEYOR MANAGEMENT (SURVEY-005)
            Route::patch('surveyors/{surveyor}/toggle-status', [\App\Http\Controllers\Admin\SurveyorController::class, 'toggleStatus'])->name('surveyors.toggle-status');
            Route::resource('surveyors', \App\Http\Controllers\Admin\SurveyorController::class)->except(['create', 'edit', 'show']);

            // SURVEY CHECKLIST MANAGEMENT (SURVEY-007)
            Route::patch('survey-checklists/{survey_checklist}/toggle-status', [\App\Http\Controllers\Admin\SurveyChecklistController::class, 'toggleStatus'])->name('survey-checklists.toggle-status');
            Route::resource('survey-checklists', \App\Http\Controllers\Admin\SurveyChecklistController::class)->except(['create', 'edit', 'show']);
        });

    // 4. OWNER AREA (Memakai Prefix URL)
    Route::prefix('owner')
        ->name('owner.')
        ->middleware('role:owner')
        ->group(function () {
            Route::get('/dashboard', function () {
                return Inertia::render('Owner/Dashboard');
            })->name('dashboard');
        });

    // 5. USER AREA (CLEAN URL - Tanpa Prefix URL "/user")
    Route::name('user.')
        ->middleware('role:user')
        ->group(function () {

            // URL menjadi http://domain.com/my-dashboard atau http://domain.com/home
            Route::get('/my-dashboard', function () {
                return Inertia::render('User/Dashboard');
            })->name('dashboard');

            // Contoh rute clean user lainnya:
            // Route::get('/kosts', [KostController::class, 'index'])->name('kost.index'); // domain.com/kosts
            // Route::get('/bookings', [BookingController::class, 'index'])->name('booking.index'); // domain.com/bookings
        });
});

// 6. PROFILE ROUTES
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';