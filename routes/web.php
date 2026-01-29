<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KelolaTargetController;
use App\Http\Controllers\KelolaUlasanController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\UlasanController;
use App\Http\Controllers\VerifikasiUlasanController;
use App\Http\Controllers\KelolaUserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'index'])->name('landing');
Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('google.auth');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('/ulasan', [UlasanController::class, 'store'])->name('ulasan.store');
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});

Route::middleware(['auth', 'role:admin'])->prefix('dashboard')->name('dashboard.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('index');
    Route::get('/panduan', [DashboardController::class, 'panduan'])->name('panduan');
    Route::get('/ulasan', [KelolaUlasanController::class, 'index'])->name('ulasan.index');
    Route::post('/ulasan/analyze', [KelolaUlasanController::class, 'analyze'])->name('ulasan.analyze');
    Route::post('/ulasan/bulk-destroy', [KelolaUlasanController::class, 'bulkDestroy'])->name('ulasan.bulk-destroy');
    Route::patch('/ulasan/{ulasan}', [KelolaUlasanController::class, 'update'])->name('ulasan.update');
    Route::delete('/ulasan/{ulasan}', [KelolaUlasanController::class, 'destroy'])->name('ulasan.destroy');
    Route::get('/ulasan/verifikasi', [VerifikasiUlasanController::class, 'index'])->name('ulasan.verifikasi');
    Route::patch('/ulasan/{ulasan}/verifikasi', [VerifikasiUlasanController::class, 'update'])->name('ulasan.doVerifikasi');
    Route::get('/target', [KelolaTargetController::class, 'index'])->name('target.index');
    Route::post('/target/bulk-destroy', [KelolaTargetController::class, 'bulkDestroy'])->name('target.bulk-destroy');
    Route::post('/target', [KelolaTargetController::class, 'store'])->name('target.store');
    Route::patch('/target/{target}', [KelolaTargetController::class, 'update'])->name('target.update');
    Route::delete('/target/{target}', [KelolaTargetController::class, 'destroy'])->name('target.destroy');
    Route::get('/users', [KelolaUserController::class, 'index'])->name('users.index');
    Route::post('/users/bulk-destroy', [KelolaUserController::class, 'bulkDestroy'])->name('users.bulk-destroy');
    Route::patch('/users/{user}', [KelolaUserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [KelolaUserController::class, 'destroy'])->name('users.destroy');
    Route::get('/search', SearchController::class)->name('search');
    Route::get('/notifications', [NotifikasiController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/mark-as-read', [NotifikasiController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/chat', [ChatbotController::class, 'handle'])->name('chat');
});
