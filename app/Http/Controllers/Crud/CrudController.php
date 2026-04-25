<?php

namespace App\Http\Controllers\Crud;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

abstract class CrudController extends Controller
{
    protected string $modelClass;

    protected string $moduleKey;

    protected string $resourceKey;

    protected string $routeNamePrefix;

    protected string $resourceLabel;

    protected string $resourcePluralLabel;

    protected string $pageSubtitle = 'Backend-managed master records using Laravel CRUD.';

    protected string $viewPermission;

    protected ?string $createPermission = null;

    protected ?string $updatePermission = null;

    protected array $with = [];

    protected array $searchable = [];

    protected array $columns = [];

    protected int $perPage = 15;

    protected string $defaultSortColumn = 'name';

    protected string $defaultSortDirection = 'asc';

    public function index(Request $request): View
    {
        $query = $this->indexQuery();

        if ($request->filled('q')) {
            $this->applySearch($query, (string) $request->query('q'));
        }

        $records = $query
            ->orderBy($this->defaultSortColumn, $this->defaultSortDirection)
            ->paginate($this->perPage)
            ->withQueryString();

        return view('crud.index', $this->sharedViewData($request, [
            'records' => $records,
            'resourceKey' => $this->resourceKey,
            'resourceLabel' => $this->resourceLabel,
            'resourcePluralLabel' => $this->resourcePluralLabel,
            'pageTitle' => $this->resourcePluralLabel,
            'pageSubtitle' => $this->pageSubtitle,
            'columns' => $this->columns,
            'routeNamePrefix' => $this->routeNamePrefix,
            'searchTerm' => (string) $request->query('q', ''),
            'canCreate' => $this->createPermission ? $this->userCan($request, $this->createPermission) : false,
            'canEdit' => $this->updatePermission ? $this->userCan($request, $this->updatePermission) : false,
            'canDelete' => $request->user()->hasRole('Admin'),
        ]));
    }

    public function create(Request $request): View
    {
        $record = $this->newModel();

        return view('crud.form', $this->sharedViewData($request, [
            'record' => $record,
            'pageTitle' => 'Create '.$this->resourceLabel,
            'pageSubtitle' => 'Add a new '.$this->resourceLabel.' record.',
            'resourceKey' => $this->resourceKey,
            'resourceLabel' => $this->resourceLabel,
            'resourcePluralLabel' => $this->resourcePluralLabel,
            'routeNamePrefix' => $this->routeNamePrefix,
            'formAction' => route($this->storeRouteName()),
            'formMethod' => 'POST',
            'formPartial' => $this->formPartial(),
            'formData' => $this->formData($request, $record),
            'submitLabel' => 'Save '.$this->resourceLabel,
        ]));
    }

    public function edit(Request $request): View
    {
        $record = $this->resolveCurrentRecord($request);

        return view('crud.form', $this->sharedViewData($request, [
            'record' => $record,
            'pageTitle' => 'Edit '.$this->resourceLabel,
            'pageSubtitle' => 'Update the selected '.$this->resourceLabel.' record.',
            'resourceKey' => $this->resourceKey,
            'resourceLabel' => $this->resourceLabel,
            'resourcePluralLabel' => $this->resourcePluralLabel,
            'routeNamePrefix' => $this->routeNamePrefix,
            'formAction' => route($this->updateRouteName(), $record),
            'formMethod' => 'PUT',
            'formPartial' => $this->formPartial(),
            'formData' => $this->formData($request, $record),
            'submitLabel' => 'Update '.$this->resourceLabel,
        ]));
    }

    protected function storeRecord(FormRequest $request): RedirectResponse
    {
        $record = $this->newModel();

        $this->persistRecord($record, $request->validated(), $request);

        return redirect()
            ->route($this->indexRouteName())
            ->with('status', $this->resourceLabel.' created successfully.');
    }

    protected function updateRecord(FormRequest $request, Model $record): RedirectResponse
    {
        $this->persistRecord($record, $request->validated(), $request);

        return redirect()
            ->route($this->indexRouteName())
            ->with('status', $this->resourceLabel.' updated successfully.');
    }

    protected function destroyRecord(Request $request, Model $record): RedirectResponse
    {
        try {
            $record->delete();

            return redirect()
                ->route($this->indexRouteName())
                ->with('status', $this->resourceLabel.' deleted successfully.');
        } catch (QueryException $exception) {
            return redirect()
                ->route($this->indexRouteName())
                ->withErrors([
                    'delete' => 'This '.$this->resourceLabel.' record cannot be deleted because other records still depend on it.',
                ]);
        }
    }

    protected function sharedViewData(Request $request, array $extra = []): array
    {
        $user = $request->user()->loadMissing(['roles.permissions', 'department', 'shift', 'factoryUnit']);

        return array_merge([
            'user' => $user,
            'modules' => $this->accessibleModules($user),
            'currentModuleKey' => $this->moduleKey,
        ], $extra);
    }

    protected function accessibleModules(Model $user): Collection
    {
        return collect(config('access.modules', []))
            ->map(function (array $module, string $key) use ($user): array {
                return [
                    'key' => $key,
                    'label' => $module['label'],
                    'description' => $module['description'],
                    'permission' => $module['permission'],
                    'granted' => $user->canAccessModule($key),
                    'url' => route('app.modules.show', ['module' => $key]),
                ];
            })
            ->values();
    }

    protected function indexQuery(): Builder
    {
        return $this->newModel()->newQuery()->with($this->with);
    }

    protected function applySearch(Builder $query, string $term): void
    {
        $searchable = $this->searchable;

        if ($term === '' || $searchable === []) {
            return;
        }

        $query->where(function (Builder $builder) use ($searchable, $term): void {
            foreach ($searchable as $column) {
                $builder->orWhere($column, 'like', '%'.$term.'%');
            }
        });
    }

    protected function formData(Request $request, ?Model $record = null): array
    {
        return [];
    }

    protected function formPartial(): string
    {
        return 'crud.partials.fields.'.$this->resourceKey;
    }

    protected function persistRecord(Model $record, array $validated, Request $request): void
    {
        $record->fill($validated);
        $record->save();
    }

    protected function resolveCurrentRecord(Request $request): Model
    {
        $parameters = collect($request->route()?->parametersWithoutNulls() ?? []);

        $record = $parameters
            ->first(fn (mixed $parameter): bool => $parameter instanceof Model);

        if ($record instanceof Model) {
            return $record;
        }

        $routeValue = $parameters->first();

        abort_unless($routeValue !== null, 404);

        return $this->newModel()->newQuery()->findOrFail($routeValue);
    }

    protected function userCan(Request $request, string $permission): bool
    {
        return $request->user()->hasPermission($permission);
    }

    protected function newModel(): Model
    {
        $class = $this->modelClass;

        return new $class();
    }

    protected function indexRouteName(): string
    {
        return $this->routeNamePrefix.'.index';
    }

    protected function storeRouteName(): string
    {
        return $this->routeNamePrefix.'.store';
    }

    protected function updateRouteName(): string
    {
        return $this->routeNamePrefix.'.update';
    }
}
