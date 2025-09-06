<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\McqController;
use App\Http\Controllers\McqsRephraseController;
use App\Http\Controllers\PaperController;
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
        Route::post('/{mcqsRephrase}/edit', [McqsRephraseController::class, 'edit'])->name('rephrase.edit');
        Route::get('/{mcqsRephrase}/edit', [McqsRephraseController::class, 'edit'])->name('rephrase.edit');
        Route::get('/{mcqsRephrase}/delete', [McqsRephraseController::class, 'destroy'])->name('rephrase.delete');
        Route::get('/{mcqsRephrase}/rephrase', [McqsRephraseController::class, 'rephrase'])->name('rephrase.rephrase');
        Route::get('/{mcqsRephrase}/rephrase/confirm', [McqsRephraseController::class, 'confirmRephrase'])->name('rephrase.confirm-rephrase');
        Route::post('/{mcqsRephrase}/rephrase', [McqsRephraseController::class, 'storeRephrase'])->name('rephrase.store-rephrase');
        Route::post('/{mcqsRephrase}/update', [McqsRephraseController::class, 'update'])->name('rephrase.update');
    });
    Route::group(['prefix' => 'mcqs'], function () {
        Route::get('/', [McqController::class, 'index'])->name('mcqs.index');
        Route::get('/create', [McqController::class, 'create'])->name('mcqs.create');
        Route::post('/store', [McqController::class, 'store'])->name('mcqs.store');
        // Route::get('/{id}', [McqController::class, 'show'])->name('mcqs.show');
        Route::get('/{slug}', [McqController::class, 'show'])->where('slug', '[a-zA-Z0-9\-_]+')
            ->name('mcqs.show');
        Route::get('/{slug}/edit', [McqController::class, 'edit'])->where('slug', '[a-zA-Z0-9\-_]+')
            ->name('mcqs.edit');
        Route::post('/{slug}/update', [McqController::class, 'update'])->where('slug', '[a-zA-Z0-9\-_]+')
            ->name('mcqs.update');
        Route::patch('/{slug}/field', [McqController::class, 'toggleField'])->where('slug', '[a-zA-Z0-9\-_]+')->name('mcqs.update-field');
        Route::delete('/{slug}', [McqController::class, 'destroy'])->where('slug', '[a-zA-Z0-9\-_]+')
            ->name('mcqs.delete');
    });
    Route::group(['prefix' => 'deleted'], function () {
        Route::get('/mcqs', [McqController::class, 'deleted'])->name('mcqs.trashbin');
        Route::get('/{id}/restore', [McqController::class, 'restore'])->name('mcqs.restore');
        Route::get('/{id}/delete-permanently', [McqController::class, 'forceDelete'])->name('mcqs.delete-permanently');
    });

    // Route::resource('papers', \App\Http\Controllers\PaperController::class);
    Route::group(['prefix' => 'papers'], function () {
        Route::get('/', [PaperController::class, 'index'])->name('papers.index');
        Route::get('/create', [PaperController::class, 'create'])->name('papers.create');
        Route::get('/{paper}', [PaperController::class, 'show'])->name('papers.show');
        Route::get('/{paper}/edit', [PaperController::class, 'edit'])->name('papers.edit');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
