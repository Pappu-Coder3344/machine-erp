<?php

namespace App\Http\Controllers\Setup;

use App\Http\Controllers\Crud\CrudController;
use App\Http\Requests\Setup\FloorRequest;
use App\Models\FactoryUnit;
use App\Models\Floor;
use App\Models\Shift;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FloorController extends CrudController
{
    protected string $modelClass = Floor::class;
    protected string $moduleKey = 'setup';
    protected string $resourceKey = 'floors';
    protected string $routeNamePrefix = 'app.setup.floors';
    protected string $resourceLabel = 'Floor';
    protected string $resourcePluralLabel = 'Floors';
    protected string $viewPermission = 'setup.view';
    protected ?string $createPermission = 'setup.create';
    protected ?string $updatePermission = 'setup.update';
    protected array $with = ['factoryUnit', 'shift'];
    protected array $searchable = ['code', 'name', 'area_type', 'supervisor_name', 'status'];
    protected array $columns = [
        ['label' => 'Code', 'key' => 'code'],
        ['label' => 'Name', 'key' => 'name'],
        ['label' => 'Factory Unit', 'key' => 'factoryUnit.name'],
        ['label' => 'Shift', 'key' => 'shift.name'],
        ['label' => 'Status', 'key' => 'status', 'format' => 'badge', 'badge_map' => ['Active' => 'success', 'Inactive' => 'secondary']],
    ];

    protected function formData(Request $request, ?\Illuminate\Database\Eloquent\Model $record = null): array
    {
        return [
            'factoryUnits' => FactoryUnit::query()->orderBy('name')->get(),
            'shifts' => Shift::query()->orderBy('name')->get(),
        ];
    }

    public function store(FloorRequest $request): RedirectResponse
    {
        return $this->storeRecord($request);
    }

    public function update(FloorRequest $request, Floor $floor): RedirectResponse
    {
        return $this->updateRecord($request, $floor);
    }

    public function destroy(Request $request, Floor $floor): RedirectResponse
    {
        return $this->destroyRecord($request, $floor);
    }
}
