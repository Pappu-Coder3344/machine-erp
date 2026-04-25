<?php

namespace App\Http\Controllers\Setup;

use App\Http\Controllers\Crud\CrudController;
use App\Http\Requests\Setup\DepartmentRequest;
use App\Models\Department;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DepartmentController extends CrudController
{
    protected string $modelClass = Department::class;
    protected string $moduleKey = 'setup';
    protected string $resourceKey = 'departments';
    protected string $routeNamePrefix = 'app.setup.departments';
    protected string $resourceLabel = 'Department';
    protected string $resourcePluralLabel = 'Departments';
    protected string $viewPermission = 'setup.view';
    protected ?string $createPermission = 'setup.create';
    protected ?string $updatePermission = 'setup.update';
    protected array $searchable = ['code', 'name', 'description'];
    protected array $columns = [
        ['label' => 'Code', 'key' => 'code'],
        ['label' => 'Name', 'key' => 'name'],
        ['label' => 'Description', 'key' => 'description'],
        ['label' => 'Status', 'key' => 'is_active', 'format' => 'boolean'],
    ];

    public function store(DepartmentRequest $request): RedirectResponse
    {
        return $this->storeRecord($request);
    }

    public function update(DepartmentRequest $request, Department $department): RedirectResponse
    {
        return $this->updateRecord($request, $department);
    }

    public function destroy(Request $request, Department $department): RedirectResponse
    {
        return $this->destroyRecord($request, $department);
    }
}
