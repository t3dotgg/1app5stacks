<?php

use Illuminate\Support\Facades\Route;

Route::get('/', \App\Livewire\Vote::class)->name('home');

Route::get('/results', \App\Livewire\Results::class)->name('results');
