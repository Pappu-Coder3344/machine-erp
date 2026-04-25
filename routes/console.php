<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('app:about', function () {
    $this->comment('LML Machine Management backend foundation.');
})->purpose('Display backend foundation information.');
