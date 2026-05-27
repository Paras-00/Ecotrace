<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\LanguageController;
use App\Http\Controllers\Web\RecycleWebController;
use App\Http\Controllers\Web\AdminDashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Unit II: Basic Routing
Route::get('/', function () {
    return view('web.home');
})->name('home');

// Unit IV: Localization switcher with parameter constraint (locale must be en, es, or hi)
// Unit III: Parameter Constraints
Route::get('/lang/{locale}', [LanguageController::class, 'switchLang'])
    ->where('locale', 'en|es|hi')
    ->name('lang.switch');

// Unit II & III: Routing with Controllers
Route::get('/recycle', [RecycleWebController::class, 'index'])->name('recycle.form');
Route::post('/recycle', [RecycleWebController::class, 'store'])->name('recycle.store');
Route::get('/recycle/success', [RecycleWebController::class, 'success'])->name('recycle.success');

// Unit III: Route Groups and Route Prefixing
Route::group(['prefix' => 'admin', 'as' => 'admin.'], function () {
    // Admin Dashboard URL: /admin/dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Delete recycle request endpoint
    Route::delete('/dashboard/{id}', [AdminDashboardController::class, 'destroy'])->name('destroy');
});
