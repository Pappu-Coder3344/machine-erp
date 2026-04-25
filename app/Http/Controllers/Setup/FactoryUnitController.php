<?php

namespace App\Http\Controllers\Setup;

use App\Http\Controllers\Crud\CrudController;
use App\Http\Requests\Setup\FactoryUnitRequest;
use App\Models\FactoryUnit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FactoryUnitController extends CrudController
{
    protected string $modelClass = FactoryUnit::class;
    protected string $moduleKey = 'setup';
    protected string $resourceKey = 'factory-units';
    protected string $routeNamePrefix = 'app.setup.factory-units';
    protected string $resourceLabel = 'Factory Unit';
    protected string $resourcePluralLabel = 'Factory Units';
    protected string $viewPermission = 'setup.view';
    protected ?string $createPermission = 'setup.create';
    protected ?string $updatePermission = 'setup.update';
    protected array $searchable = ['code', 'name', 'area_type', 'address'];
    protected array $columns = [
        ['label' => 'Code', 'key' => 'code'],
        ['label' => 'Name', 'key' => 'name'],
        ['label' => 'Area Type', 'key' => 'area_type'],
        ['label' => 'Address', 'key' => 'address'],
        ['label' => 'Status', 'key' => 'is_active', 'format' => 'boolean'],
    ];

    public function store(FactoryUnitRequest $request): RedirectResponse
    {
        return $this->storeRecord($request);
    }

    public function update(FactoryUnitRequest $request, FactoryUnit $factoryUnit): RedirectResponse
    {
        return $this->updateRecord($request, $factoryUnit);
    }

    public function destroy(Request $request, FactoryUnit $factoryUnit): RedirectResponse
    {
        return $this->destroyRecord($request, $factoryUnit);
    }
}
