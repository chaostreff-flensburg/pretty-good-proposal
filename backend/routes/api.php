<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::controller(AuthController::class)->group(function () {
    Route::post('auth/login', 'login');
    Route::post('auth/logout', 'logout');
    Route::post('auth/refresh', 'refresh');
});


Route::get('tracks', [\App\Http\Controllers\TrackController::class, 'index']);
Route::post('tracks', [\App\Http\Controllers\TrackController::class, 'create']);
Route::get('track', [\App\Http\Controllers\TrackController::class, 'show']);
Route::get('track/proposals', [\App\Http\Controllers\TrackController::class, 'proposals']);
Route::post('track/users', [\App\Http\Controllers\TrackController::class, 'addUserToTrack']);

Route::post('proposals', [\App\Http\Controllers\ProposalController::class, 'create']);
Route::get('proposal/{proposal}', [\App\Http\Controllers\ProposalController::class, 'show']);
Route::post('proposal/{proposal}/opinion', [\App\Http\Controllers\ProposalController::class, 'upsertOpinion']);


Route::get('user', [\App\Http\Controllers\UserController::class, 'me']);
Route::get('users', [\App\Http\Controllers\UserController::class, 'index']);
Route::post('user', [\App\Http\Controllers\UserController::class, 'create']);
Route::post('user/{user}', [\App\Http\Controllers\UserController::class, 'update']);
Route::post('user/{user}/password', [\App\Http\Controllers\UserController::class, 'updatePassword']);
