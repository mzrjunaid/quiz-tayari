<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\McqsRephraseController;
use App\Http\Controllers\SampleQuiz;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/hello', [SampleQuiz::class, 'index']);


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [AdminController::class, 'index'])->name('dashboard');
    Route::get('mcqs-rephrase', [McqsRephraseController::class, 'index'])->name('mcqs-rephrase');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
