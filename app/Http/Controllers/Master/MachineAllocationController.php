<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Crud\CrudController;
use App\Http\Requests\Master\MachineAllocationRequest;
use App\Models\Floor;
use App\Models\Line;
use App\Models\Machine;
use App\Models\MachineAllocation;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MachineAllocationController extends CrudController
{
    protected string $modelClass = MachineAllocation::class;
    protected string $moduleKey = 'allocation';
    protected string $resourceKey = 'machine-allocations';
    protected string $routeNamePrefix = 'app.masters.machine-allocations';
    protected string $resourceLabel = 'Machine Allocation';
    protected string $resourcePluralLabel = 'Machine Allocations';
    protected string $viewPermission = 'allocation.view';
    protected ?string $createPermission = 'allocation.create';
    protected ?string $updatePermission = 'allocation.create';
    protected array $with = ['machine', 'fromFloor', 'fromLine', 'toFloor', 'toLine', 'allocatedBy'];
    protected array $searchable = ['allocation_type', 'reason', 'status'];
    protected array $columns = [
        ['label' => 'Machine', 'key' => 'machine.code'],
        ['label' => 'Type', 'key' => 'allocation_type'],
        ['label' => 'From Floor', 'key' => 'fromFloor.name'],
        ['label' => 'To Floor', 'key' => 'toFloor.name'],
        ['label' => 'Allocated At', 'key' => 'allocated_at', 'format' => 'datetime'],
        ['label' => 'Status', 'key' => 'status', 'format' => 'badge', 'badge_map' => ['Active' => 'success', 'Transferred' => 'primary', 'Closed' => 'secondary', 'Received' => 'info', 'Reallocated' => 'warning']],
    ];

    protected string $defaultSortColumn = 'allocated_at';
    protected string $defaultSortDirection = 'desc';

    protected function formData(Request $request, ?Model $record = null): array
    {
        return [
            'machines' => Machine::query()->orderBy('code')->get(),
            'floors' => Floor::query()->with('factoryUnit')->orderBy('name')->get(),
            'lines' => Line::query()->with('floor')->orderBy('name')->get(),
            'users' => User::query()->orderBy('name')->get(),
            'allocationTypes' => ['Allocation', 'Transfer', 'Receive', 'Reallocation'],
            'statuses' => ['Active', 'Received', 'Reallocated', 'Transferred', 'Closed'],
        ];
    }

    protected function persistRecord(Model $record, array $validated, Request $request): void
    {
        if (! isset($validated['allocated_by_user_id']) || $validated['allocated_by_user_id'] === null) {
            $validated['allocated_by_user_id'] = $request->user()->id;
        }

        $record->fill($validated);
        $record->save();

        $record->machine()->update([
            'floor_id' => $validated['to_floor_id'] ?? null,
            'line_id' => $validated['to_line_id'] ?? null,
        ]);
    }

    public function store(MachineAllocationRequest $request): RedirectResponse
    {
        return $this->storeRecord($request);
    }

    public function update(MachineAllocationRequest $request, MachineAllocation $machineAllocation): RedirectResponse
    {
        return $this->updateRecord($request, $machineAllocation);
    }

    public function destroy(Request $request, MachineAllocation $machineAllocation): RedirectResponse
    {
        return $this->destroyRecord($request, $machineAllocation);
    }
}
