<?php

namespace App\Http\Controllers\Master;

use App\Enums\MachineOwnershipType;
use App\Enums\MachineStatus;
use App\Http\Controllers\Crud\CrudController;
use App\Http\Requests\Master\MachineRequest;
use App\Models\Floor;
use App\Models\Line;
use App\Models\Machine;
use App\Models\MachineCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MachineController extends CrudController
{
    protected string $modelClass = Machine::class;
    protected string $moduleKey = 'machine-master';
    protected string $resourceKey = 'machines';
    protected string $routeNamePrefix = 'app.masters.machines';
    protected string $resourceLabel = 'Machine';
    protected string $resourcePluralLabel = 'Machines';
    protected string $viewPermission = 'machine-master.view';
    protected ?string $createPermission = 'machine-master.create';
    protected ?string $updatePermission = 'machine-master.update';
    protected array $with = ['machineCategory', 'floor', 'line'];
    protected array $searchable = ['code', 'name', 'brand', 'model', 'serial_no', 'current_status'];
    protected array $columns = [
        ['label' => 'Code', 'key' => 'code'],
        ['label' => 'Name', 'key' => 'name'],
        ['label' => 'Category', 'key' => 'machineCategory.name'],
        ['label' => 'Ownership', 'key' => 'ownership_type'],
        ['label' => 'Status', 'key' => 'current_status', 'format' => 'badge', 'badge_map' => ['Active' => 'success', 'Idle' => 'secondary', 'Breakdown' => 'danger', 'Under Maintenance' => 'warning', 'Returned' => 'secondary', 'Replaced' => 'primary']],
    ];

    protected function formData(Request $request, ?Model $record = null): array
    {
        return [
            'machineCategories' => MachineCategory::query()->where('is_active', true)->orderBy('name')->get(),
            'floors' => Floor::query()->with('factoryUnit')->orderBy('name')->get(),
            'lines' => Line::query()->with('floor')->orderBy('name')->get(),
            'ownershipTypes' => collect(MachineOwnershipType::cases())->map(fn (MachineOwnershipType $case) => $case->value)->all(),
            'statuses' => collect(MachineStatus::cases())->map(fn (MachineStatus $case) => $case->value)->all(),
            'criticalities' => ['A', 'B', 'C'],
        ];
    }

    public function store(MachineRequest $request): RedirectResponse
    {
        return $this->storeRecord($request);
    }

    public function update(MachineRequest $request, Machine $machine): RedirectResponse
    {
        return $this->updateRecord($request, $machine);
    }

    public function destroy(Request $request, Machine $machine): RedirectResponse
    {
        return $this->destroyRecord($request, $machine);
    }
}
