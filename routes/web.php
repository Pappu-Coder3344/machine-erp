<?php

use App\Http\Controllers\App\AccessPreviewController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

Route::get('/prototype-assets/{path}', function (string $path) {
    $assetRoot = realpath(base_path('assets'));
    $filePath = realpath(base_path('assets/'.$path));

    abort_unless($assetRoot && $filePath && is_file($filePath), 404);

    $normalizedRoot = str_replace('\\', '/', $assetRoot);
    $normalizedFile = str_replace('\\', '/', $filePath);

    abort_unless(
        $normalizedFile === $normalizedRoot || str_starts_with($normalizedFile, $normalizedRoot.'/'),
        404
    );

    $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
    $contentType = match ($extension) {
        'css' => 'text/css; charset=UTF-8',
        'js' => 'application/javascript; charset=UTF-8',
        'jpg', 'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'svg' => 'image/svg+xml',
        'webp' => 'image/webp',
        'gif' => 'image/gif',
        'ico' => 'image/x-icon',
        default => File::mimeType($filePath) ?: 'application/octet-stream',
    };

    return response()->file($filePath, [
        'Content-Type' => $contentType,
    ]);
})->where('path', '.*')->name('prototype-assets');

Route::redirect('/', '/login');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
});

Route::middleware(['auth', 'account.access'])->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::prefix('app')->name('app.')->group(function () {
        Route::get('/', [AccessPreviewController::class, 'dashboard'])
            ->middleware('permission:dashboard.view')
            ->name('dashboard');

        Route::get('/modules/{module}', [AccessPreviewController::class, 'module'])
            ->middleware('module.access')
            ->name('modules.show');
    });
});

require __DIR__.'/crud.php';
