<?php

namespace App\Http\Controllers\Setup;

use App\Enums\PmFrequency;
use App\Http\Controllers\Crud\CrudController;
use App\Http\Requests\Setup\MachineCategoryRequest;
use App\Models\MachineCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MachineCategoryController extends CrudController
{
    protected string $modelClass = MachineCategory::class;
    protected string $moduleKey = 'setup';
    protected string $resourceKey = 'machine-categories';
    protected string $routeNamePrefix = 'app.setup.machine-categories';
    protected string $resourceLabel = 'Machine Category';
    protected string $resourcePluralLabel = 'Machine Categories';
    protected string $viewPermission = 'setup.view';
    protected ?string $createPermission = 'setup.create';
    protected ?string $updatePermission = 'setup.update';
    protected array $searchable = ['code', 'name', 'default_pm_frequency', 'description'];
    protected array $columns = [
        ['label' => 'Code', 'key' => 'code'],
        ['label' => 'Name', 'key' => 'name'],
        ['label' => 'Default PM', 'key' => 'default_pm_frequency'],
        ['label' => 'Status', 'key' => 'is_active', 'format' => 'boolean'],
    ];

    protected function formData(Request $request, ?\Illuminate\Database\Eloquent\Model $record = null): array
    {
        return [
            'pmFrequencies' => collect(PmFrequency::cases())->map(fn (PmFrequency $case) => $case->value)->all(),
        ];
    }

    public function store(MachineCategoryRequest $request): RedirectResponse
    {
        return $this->storeRecord($request);
    }

    public function update(MachineCategoryRequest $request, MachineCategory $machineCategory): RedirectResponse
    {
        return $this->updateRecord($request, $machineCategory);
    }

    public function destroy(Request $request, MachineCategory $machineCategory): RedirectResponse
    {
        return $this->destroyRecord($request, $machineCategory);
    }
}
