<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\HomepageController;
use App\Http\Controllers\McqController;
use App\Http\Controllers\McqsRephraseController;
use App\Http\Controllers\PaperController;
use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



// Admin Routes
Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified', 'role:admin', 'status:approved'])->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('dashboard');
    Route::get('/old-mcqs', [McqsRephraseController::class, 'old_mcqs'])->name('old-mcqs');
    Route::prefix('rephrase')->name('rephrase.')->group(function () {
        Route::get('/', [McqsRephraseController::class, 'index'])->name('index');
        Route::get('/{id}', [McqsRephraseController::class, 'show'])->name('show');
        Route::post('/{mcqsRephrase}/edit', [McqsRephraseController::class, 'edit'])->name('edit');
        Route::get('/{mcqsRephrase}/edit', [McqsRephraseController::class, 'edit'])->name('edit');
        Route::get('/{mcqsRephrase}/delete', [McqsRephraseController::class, 'destroy'])->name('delete');
        Route::get('/{mcqsRephrase}/rephrase', [McqsRephraseController::class, 'rephrase'])->name('rephrase');
        Route::get('/{mcqsRephrase}/rephrase/confirm', [McqsRephraseController::class, 'confirmRephrase'])->name('confirm-rephrase');
        Route::post('/{mcqsRephrase}/rephrase', [McqsRephraseController::class, 'storeRephrase'])->name('store-rephrase');
        Route::post('/{mcqsRephrase}/update', [McqsRephraseController::class, 'update'])->name('update');
    });
    Route::group(['prefix' => 'mcqs'], function () {
        Route::get('/', [McqController::class, 'index'])->name('mcqs.index');
        Route::get('/create', [McqController::class, 'create'])->name('mcqs.create');
        Route::get('/assign-paper', [McqController::class, 'assignPaper'])->name('mcqs.assign-paper');
        Route::put('/update-ids', [McqController::class, 'updatePaperIds'])->name('mcqs.update-ids');
        Route::post('/store', [McqController::class, 'store'])->name('mcqs.store');
        // Route::get('/{id}', [McqController::class, 'show'])->name('mcqs.show');
        Route::get('/{slug}', [McqController::class, 'show'])->where('slug', '[a-zA-Z0-9\-_]+')
            ->name('mcqs.show');
        Route::get('/{id}', [McqController::class, 'show'])->name('mcqs.show');
        Route::get('/{slug}/edit', [McqController::class, 'edit'])->where('slug', '[a-zA-Z0-9\-_]+')
            ->name('mcqs.edit');
        Route::patch('/{slug}/update', [McqController::class, 'update'])->where('slug', '[a-zA-Z0-9\-_]+')
            ->name('mcqs.update');
        Route::patch('/{slug}/field', [McqController::class, 'toggleField'])->where('slug', '[a-zA-Z0-9\-_]+')->name('mcqs.update-field');
        Route::delete('/{slug}', [McqController::class, 'destroy'])->where('slug', '[a-zA-Z0-9\-_]+')
            ->name('mcqs.delete');
    });
    Route::group(['prefix' => 'trash'], function () {
        Route::get('/mcqs', [McqController::class, 'deleted'])->name('mcqs.trashbin');
        Route::get('/{id}/restore', [McqController::class, 'restore'])->name('mcqs.restore');
        Route::get('/{id}/delete-permanently', [McqController::class, 'forceDelete'])->name('mcqs.delete-permanently');
    });

    Route::group(['prefix' => 'papers'], function () {
        Route::get('/', [PaperController::class, 'index'])->name('papers.index');
        Route::get('/create', [PaperController::class, 'create'])->name('papers.create');
        Route::post('/store', [PaperController::class, 'store'])->name('papers.store');
        Route::get('/{paper}', [PaperController::class, 'show'])->name('papers.show');
        Route::get('/{paper}/edit', [PaperController::class, 'edit'])->name('papers.edit');
        Route::get('/{paper}/delete', [PaperController::class, 'destroy'])->name('papers.delete');
    });
});


// Public Routes

// Homepage & General Public Routes
Route::get('/', [HomepageController::class, 'index'])->name('home');
Route::get('/demo', function () {
    return Inertia::render('Public/Demo', []);
})->name('demo');
Route::get('/contact-us', [HomepageController::class, 'contact_us'])->name('contact-us');
Route::get('/privacy-policy', [HomepageController::class, 'privacy_policy'])->name('privacy-policy');
Route::get('/terms-of-service', [HomepageController::class, 'terms_of_service'])->name('terms-of-service');
Route::get('/help-center', [HomepageController::class, 'help_center'])->name('help.center');
Route::post('/set-mcq-mode', [HomepageController::class, 'setMcqMode'])->name('set-mcq-mode');


Route::name('public.')->group(function () {
    Route::get('/search', [SearchController::class, 'index'])->name('search');


    // Papers
    Route::prefix('papers')->name('papers.')->group(function () {
        //Papers List
        Route::get('/', [HomepageController::class, 'papers_list'])->name('index');

        //paper mcqs List
        Route::get('/{paper:slug}/mcqs', [HomepageController::class, 'papers_mcqs'])->name('show');
        Route::get('/{paper:slug}', function ($slug) {
            return redirect()->route('public.papers.show', $slug);
        });

        // Nested MCQs Routes
        Route::prefix('/{paper:slug}/mcqs')->name('mcqs.')->group(function () {
            Route::get('/{mcq:slug}', [HomepageController::class, 'show_mcq'])->name('show');
        });
    });

    // Old Papers

    Route::prefix('old-papers')->name('old-papers.')->group(function () {
        //Old Papers List
        Route::get('/', [HomepageController::class, 'old_papers_list'])->name('index');

        //old paper mcqs List
        Route::get('/{old_paper:slug}/mcqs', [HomepageController::class, 'old_papers_mcqs'])->name('show');
        Route::get('/{old_paper:slug}', function ($slug) {
            return redirect()->route('public.old-papers.show', $slug);
        });

        // Nested MCQs Routes
        Route::prefix('/{old_paper:slug}/mcqs')->name('mcqs.')->group(function () {
            Route::get('/{mcq:slug}', [HomepageController::class, 'old_show_mcq'])->name('show');
        });
    });

    // MCQs without Papers
    Route::prefix('mcqs')->name('mcqs.')->group(function () {
        Route::get('/{mcq:slug}', [HomepageController::class, 'single_show_mcq'])->name('show');
    });
});



// Search Route and Search API Route
Route::get('/api/search-suggestions', [SearchController::class, 'suggestions']);


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
