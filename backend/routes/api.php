<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\FacilityAPIController;
use App\Http\Controllers\API\DeviceAPIController;
use App\Http\Controllers\API\RecycleRequestAPIController;
use App\Http\Controllers\API\AuthAPIController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Authentication endpoints
Route::post('/auth/register', [AuthAPIController::class, 'register']);
Route::post('/auth/login', [AuthAPIController::class, 'login']);
Route::get('/auth/history', [AuthAPIController::class, 'history']);

// Facility locator endpoints
Route::get('/facilities', [FacilityAPIController::class, 'index']);
Route::get('/facilities/{id}', [FacilityAPIController::class, 'show']);

// Device evaluation and list endpoints
Route::get('/devices', [DeviceAPIController::class, 'index']);
Route::post('/devices/evaluate', [DeviceAPIController::class, 'evaluate']);

// Submission endpoint
Route::post('/recycle-requests', [RecycleRequestAPIController::class, 'store']);
