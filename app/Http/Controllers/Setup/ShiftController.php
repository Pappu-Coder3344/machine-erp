<?php

namespace App\Http\Controllers\Setup;

use App\Http\Controllers\Crud\CrudController;
use App\Http\Requests\Setup\ShiftRequest;
use App\Models\Shift;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ShiftController extends CrudController
{
    protected string $modelClass = Shift::class;
    protected string $moduleKey = 'setup';
    protected string $resourceKey = 'shifts';
    protected string $routeNamePrefix = 'app.setup.shifts';
    protected string $resourceLabel = 'Shift';
    protected string $resourcePluralLabel = 'Shifts';
    protected string $viewPermission = 'setup.view';
    protected ?string $createPermission = 'setup.create';
    protected ?string $updatePermission = 'setup.update';
    protected array $searchable = ['code', 'name', 'description'];
    protected array $columns = [
        ['label' => 'Code', 'key' => 'code'],
        ['label' => 'Name', 'key' => 'name'],
        ['label' => 'Start Time', 'key' => 'start_time'],
        ['label' => 'End Time', 'key' => 'end_time'],
        ['label' => 'Status', 'key' => 'is_active', 'format' => 'boolean'],
    ];

    public function store(ShiftRequest $request): RedirectResponse
    {
        return $this->storeRecord($request);
    }

    public function update(ShiftRequest $request, Shift $shift): RedirectResponse
    {
        return $this->updateRecord($request, $shift);
    }

    public function destroy(Request $request, Shift $shift): RedirectResponse
    {
        return $this->destroyRecord($request, $shift);
    }
}
