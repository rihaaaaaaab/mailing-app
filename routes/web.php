<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;
use App\Http\Controllers\CampaignController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware([
    'auth',
    ValidateSessionWithWorkOS::class,
])->group(function () {
    Route::get('dashboard', function () {
        $lists = \App\Models\ContactList::withCount('contacts')->get();
        return Inertia::render('dashboard', [
            'lists' => $lists
        ]);
    })->name('dashboard');

    Route::post('/lists', [\App\Http\Controllers\ContactListController::class, 'store']);
    Route::put('/lists/{list}', [\App\Http\Controllers\ContactListController::class, 'update']);
    Route::delete('/lists/{list}', [\App\Http\Controllers\ContactListController::class, 'destroy']);
    Route::get('/lists/{list}', [\App\Http\Controllers\ContactListController::class, 'show'])->name('lists.show');
    Route::get('/lists/{list}/contacts', [\App\Http\Controllers\ContactListController::class, 'show'])->name('lists.contacts');
    Route::post('/lists/{list}/contacts', [\App\Http\Controllers\ContactController::class, 'store'])->name('contacts.store');
    Route::resource('campaigns', CampaignController::class)->except(['show']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
