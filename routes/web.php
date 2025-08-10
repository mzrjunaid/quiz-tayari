<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\McqController;
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
    Route::group(['prefix' => 'rephrase'], function () {
        Route::get('/', [McqsRephraseController::class, 'index'])->name('rephrase.index');
        Route::get('/{id}', [McqsRephraseController::class, 'show'])->name('rephrase.show');
        Route::get('/{mcqsRephrase}/edit', [McqsRephraseController::class, 'edit'])->name('rephrase.edit');
        Route::get('/{mcqsRephrase}/delete', [McqsRephraseController::class, 'destroy'])->name('rephrase.delete');
        Route::get('/{mcqsRephrase}/rephrase', [McqsRephraseController::class, 'rephrase'])->name('rephrase.rephrase');
        Route::get('/{mcqsRephrase}/rephrase/confirm', [McqsRephraseController::class, 'confirmRephrase'])->name('rephrase.confirm-rephrase');
        Route::post('/{mcqsRephrase}/rephrase', [McqsRephraseController::class, 'storeRephrase'])->name('rephrase.store-rephrase');
        Route::post('/{mcqsRephrase}/update', [McqsRephraseController::class, 'update'])->name('rephrase.update');
    });
    Route::group(['prefix' => 'mcqs'], function () {
        Route::get('/', [McqController::class, 'index'])->name('mcqs.index');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
