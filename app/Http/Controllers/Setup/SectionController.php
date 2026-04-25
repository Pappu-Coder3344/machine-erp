<?php

namespace App\Http\Controllers\Setup;

use App\Http\Controllers\Crud\CrudController;
use App\Http\Requests\Setup\SectionRequest;
use App\Models\Floor;
use App\Models\Section;
use App\Models\Shift;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SectionController extends CrudController
{
    protected string $modelClass = Section::class;
    protected string $moduleKey = 'setup';
    protected string $resourceKey = 'sections';
    protected string $routeNamePrefix = 'app.setup.sections';
    protected string $resourceLabel = 'Section';
    protected string $resourcePluralLabel = 'Sections';
    protected string $viewPermission = 'setup.view';
    protected ?string $createPermission = 'setup.create';
    protected ?string $updatePermission = 'setup.update';
    protected array $with = ['floor', 'shift'];
    protected array $searchable = ['code', 'name', 'line_group_name', 'machine_focus', 'status'];
    protected array $columns = [
        ['label' => 'Code', 'key' => 'code'],
        ['label' => 'Name', 'key' => 'name'],
        ['label' => 'Floor', 'key' => 'floor.name'],
        ['label' => 'Shift', 'key' => 'shift.name'],
        ['label' => 'Status', 'key' => 'status', 'format' => 'badge', 'badge_map' => ['Active' => 'success', 'Inactive' => 'secondary']],
    ];

    protected function formData(Request $request, ?\Illuminate\Database\Eloquent\Model $record = null): array
    {
        return [
            'floors' => Floor::query()->with('factoryUnit')->orderBy('name')->get(),
            'shifts' => Shift::query()->orderBy('name')->get(),
        ];
    }

    public function store(SectionRequest $request): RedirectResponse
    {
        return $this->storeRecord($request);
    }

    public function update(SectionRequest $request, Section $section): RedirectResponse
    {
        return $this->updateRecord($request, $section);
    }

    public function destroy(Request $request, Section $section): RedirectResponse
    {
        return $this->destroyRecord($request, $section);
    }
}
