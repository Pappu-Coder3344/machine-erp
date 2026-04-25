<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Crud\CrudController;
use App\Http\Requests\Master\AgreementRequest;
use App\Models\Agreement;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AgreementController extends CrudController
{
    protected string $modelClass = Agreement::class;
    protected string $moduleKey = 'agreements';
    protected string $resourceKey = 'agreements';
    protected string $routeNamePrefix = 'app.masters.agreements';
    protected string $resourceLabel = 'Agreement';
    protected string $resourcePluralLabel = 'Agreements';
    protected string $viewPermission = 'agreements.view';
    protected ?string $createPermission = 'agreements.create';
    protected ?string $updatePermission = 'agreements.update';
    protected array $with = ['vendor'];
    protected array $searchable = ['code', 'type', 'coverage', 'status', 'renewal_risk'];
    protected string $defaultSortColumn = 'code';
    protected array $columns = [
        ['label' => 'Code', 'key' => 'code'],
        ['label' => 'Vendor', 'key' => 'vendor.name'],
        ['label' => 'Type', 'key' => 'type'],
        ['label' => 'End Date', 'key' => 'end_date', 'format' => 'date'],
        ['label' => 'Status', 'key' => 'status', 'format' => 'badge', 'badge_map' => ['Active' => 'success', 'Draft' => 'secondary', 'Expiring Soon' => 'warning', 'Expired' => 'secondary', 'Blocked' => 'danger']],
    ];

    protected function formData(Request $request, ?Model $record = null): array
    {
        return [
            'vendors' => Vendor::query()->orderBy('name')->get(),
        ];
    }

    public function store(AgreementRequest $request): RedirectResponse
    {
        return $this->storeRecord($request);
    }

    public function update(AgreementRequest $request, Agreement $agreement): RedirectResponse
    {
        return $this->updateRecord($request, $agreement);
    }

    public function destroy(Request $request, Agreement $agreement): RedirectResponse
    {
        return $this->destroyRecord($request, $agreement);
    }
}
