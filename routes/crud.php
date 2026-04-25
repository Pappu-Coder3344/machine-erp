<?php

use App\Http\Controllers\Master\AgreementController;
use App\Http\Controllers\Master\MachineAllocationController;
use App\Http\Controllers\Master\MachineController;
use App\Http\Controllers\Master\RentMachineDetailController;
use App\Http\Controllers\Master\UserController;
use App\Http\Controllers\Master\VendorController;
use App\Http\Controllers\Setup\DepartmentController;
use App\Http\Controllers\Setup\FactoryUnitController;
use App\Http\Controllers\Setup\FloorController;
use App\Http\Controllers\Setup\LineController;
use App\Http\Controllers\Setup\MachineCategoryController;
use App\Http\Controllers\Setup\SectionController;
use App\Http\Controllers\Setup\ShiftController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'account.access'])->prefix('app')->name('app.')->group(function () {
    Route::prefix('setup')->name('setup.')->group(function () {
        Route::resource('departments', DepartmentController::class)
            ->except(['show'])
            ->middlewareFor('index', 'permission:setup.view')
            ->middlewareFor(['create', 'store'], 'permission:setup.create')
            ->middlewareFor(['edit', 'update'], 'permission:setup.update')
            ->middlewareFor('destroy', 'role:Admin');

        Route::resource('shifts', ShiftController::class)
            ->except(['show'])
            ->middlewareFor('index', 'permission:setup.view')
            ->middlewareFor(['create', 'store'], 'permission:setup.create')
            ->middlewareFor(['edit', 'update'], 'permission:setup.update')
            ->middlewareFor('destroy', 'role:Admin');

        Route::resource('factory-units', FactoryUnitController::class)
            ->parameters(['factory-units' => 'factoryUnit'])
            ->except(['show'])
            ->middlewareFor('index', 'permission:setup.view')
            ->middlewareFor(['create', 'store'], 'permission:setup.create')
            ->middlewareFor(['edit', 'update'], 'permission:setup.update')
            ->middlewareFor('destroy', 'role:Admin');

        Route::resource('floors', FloorController::class)
            ->except(['show'])
            ->middlewareFor('index', 'permission:setup.view')
            ->middlewareFor(['create', 'store'], 'permission:setup.create')
            ->middlewareFor(['edit', 'update'], 'permission:setup.update')
            ->middlewareFor('destroy', 'role:Admin');

        Route::resource('sections', SectionController::class)
            ->except(['show'])
            ->middlewareFor('index', 'permission:setup.view')
            ->middlewareFor(['create', 'store'], 'permission:setup.create')
            ->middlewareFor(['edit', 'update'], 'permission:setup.update')
            ->middlewareFor('destroy', 'role:Admin');

        Route::resource('lines', LineController::class)
            ->except(['show'])
            ->middlewareFor('index', 'permission:setup.view')
            ->middlewareFor(['create', 'store'], 'permission:setup.create')
            ->middlewareFor(['edit', 'update'], 'permission:setup.update')
            ->middlewareFor('destroy', 'role:Admin');

        Route::resource('machine-categories', MachineCategoryController::class)
            ->parameters(['machine-categories' => 'machineCategory'])
            ->except(['show'])
            ->middlewareFor('index', 'permission:setup.view')
            ->middlewareFor(['create', 'store'], 'permission:setup.create')
            ->middlewareFor(['edit', 'update'], 'permission:setup.update')
            ->middlewareFor('destroy', 'role:Admin');
    });

    Route::prefix('masters')->name('masters.')->group(function () {
        Route::resource('users', UserController::class)
            ->except(['show'])
            ->middlewareFor('index', 'permission:users.view')
            ->middlewareFor(['create', 'store'], 'permission:users.create')
            ->middlewareFor(['edit', 'update'], 'permission:users.update')
            ->middlewareFor('destroy', 'role:Admin');

        Route::resource('vendors', VendorController::class)
            ->except(['show'])
            ->middlewareFor('index', 'permission:vendors.view')
            ->middlewareFor(['create', 'store'], 'permission:vendors.create')
            ->middlewareFor(['edit', 'update'], 'permission:vendors.update')
            ->middlewareFor('destroy', 'role:Admin');

        Route::resource('agreements', AgreementController::class)
            ->except(['show'])
            ->middlewareFor('index', 'permission:agreements.view')
            ->middlewareFor(['create', 'store'], 'permission:agreements.create')
            ->middlewareFor(['edit', 'update'], 'permission:agreements.update')
            ->middlewareFor('destroy', 'role:Admin');

        Route::resource('machines', MachineController::class)
            ->except(['show'])
            ->middlewareFor('index', 'permission:machine-master.view')
            ->middlewareFor(['create', 'store'], 'permission:machine-master.create')
            ->middlewareFor(['edit', 'update'], 'permission:machine-master.update')
            ->middlewareFor('destroy', 'role:Admin');

        Route::resource('rent-machine-details', RentMachineDetailController::class)
            ->parameters(['rent-machine-details' => 'rentMachineDetail'])
            ->except(['show'])
            ->middlewareFor('index', 'permission:rent-machines.view')
            ->middlewareFor(['create', 'store'], 'permission:rent-machines.receive')
            ->middlewareFor(['edit', 'update'], 'permission:rent-machines.update')
            ->middlewareFor('destroy', 'role:Admin');

        Route::resource('machine-allocations', MachineAllocationController::class)
            ->parameters(['machine-allocations' => 'machineAllocation'])
            ->except(['show'])
            ->middlewareFor('index', 'permission:allocation.view')
            ->middlewareFor(['create', 'store', 'edit', 'update'], 'permission:allocation.create')
            ->middlewareFor('destroy', 'role:Admin');
    });
});
