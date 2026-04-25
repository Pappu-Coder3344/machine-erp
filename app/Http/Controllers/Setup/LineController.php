<?php

namespace App\Http\Controllers\Setup;

use App\Http\Controllers\Crud\CrudController;
use App\Http\Requests\Setup\LineRequest;
use App\Models\Floor;
use App\Models\Line;
use App\Models\Section;
use App\Models\Shift;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LineController extends CrudController
{
    protected string $modelClass = Line::class;
    protected string $moduleKey = 'setup';
    protected string $resourceKey = 'lines';
    protected string $routeNamePrefix = 'app.setup.lines';
    protected string $resourceLabel = 'Line';
    protected string $resourcePluralLabel = 'Lines';
    protected string $viewPermission = 'setup.view';
    protected ?string $createPermission = 'setup.create';
    protected ?string $updatePermission = 'setup.update';
    protected array $with = ['floor', 'section', 'shift'];
    protected array $searchable = ['code', 'name', 'current_machine_types', 'supervisor_name', 'status'];
    protected array $columns = [
        ['label' => 'Code', 'key' => 'code'],
        ['label' => 'Name', 'key' => 'name'],
        ['label' => 'Floor', 'key' => 'floor.name'],
        ['label' => 'Section', 'key' => 'section.name'],
        ['label' => 'Status', 'key' => 'status', 'format' => 'badge', 'badge_map' => ['Active' => 'success', 'Inactive' => 'secondary']],
    ];

    protected function formData(Request $request, ?\Illuminate\Database\Eloquent\Model $record = null): array
    {
        return [
            'floors' => Floor::query()->with('factoryUnit')->orderBy('name')->get(),
            'sections' => Section::query()->with('floor')->orderBy('name')->get(),
            'shifts' => Shift::query()->orderBy('name')->get(),
        ];
    }

    public function store(LineRequest $request): RedirectResponse
    {
        return $this->storeRecord($request);
    }

    public function update(LineRequest $request, Line $line): RedirectResponse
    {
        return $this->updateRecord($request, $line);
    }

    public function destroy(Request $request, Line $line): RedirectResponse
    {
        return $this->destroyRecord($request, $line);
    }
}
