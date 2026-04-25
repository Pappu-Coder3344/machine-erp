<?php

namespace App\Http\Controllers\Master;

use App\Enums\MachineOwnershipType;
use App\Enums\ReturnReplaceStatus;
use App\Http\Controllers\Crud\CrudController;
use App\Http\Requests\Master\RentMachineDetailRequest;
use App\Models\Agreement;
use App\Models\Machine;
use App\Models\RentMachineDetail;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RentMachineDetailController extends CrudController
{
    protected string $modelClass = RentMachineDetail::class;
    protected string $moduleKey = 'rent-machines';
    protected string $resourceKey = 'rent-machine-details';
    protected string $routeNamePrefix = 'app.masters.rent-machine-details';
    protected string $resourceLabel = 'Rent Machine Detail';
    protected string $resourcePluralLabel = 'Rent Machine Details';
    protected string $viewPermission = 'rent-machines.view';
    protected ?string $createPermission = 'rent-machines.receive';
    protected ?string $updatePermission = 'rent-machines.update';
    protected array $with = ['machine', 'vendor', 'agreement'];
    protected array $searchable = ['asset_tag', 'contract_notes'];
    protected string $defaultSortColumn = 'receive_date';
    protected string $defaultSortDirection = 'desc';
    protected array $columns = [
        ['label' => 'Machine', 'key' => 'machine.code'],
        ['label' => 'Asset Tag', 'key' => 'asset_tag'],
        ['label' => 'Vendor', 'key' => 'vendor.name'],
        ['label' => 'Agreement', 'key' => 'agreement.code'],
        ['label' => 'Return / Replace', 'key' => 'return_replace_status', 'format' => 'badge', 'badge_map' => ['No Request' => 'secondary', 'Requested' => 'warning', 'Vendor Review' => 'warning', 'Agreement Review' => 'info', 'Replacement Review' => 'primary', 'Approved' => 'success', 'Completed' => 'success']],
    ];

    protected function formData(Request $request, ?Model $record = null): array
    {
        return [
            'machines' => Machine::query()->orderBy('code')->get(),
            'vendors' => Vendor::query()->orderBy('name')->get(),
            'agreements' => Agreement::query()->with('vendor')->orderBy('code')->get(),
            'returnReplaceStatuses' => collect(ReturnReplaceStatus::cases())->map(fn (ReturnReplaceStatus $case) => $case->value)->all(),
        ];
    }

    protected function persistRecord(Model $record, array $validated, Request $request): void
    {
        $record->fill($validated);
        $record->save();

        $record->machine()->update([
            'ownership_type' => MachineOwnershipType::RENT->value,
        ]);
    }

    public function store(RentMachineDetailRequest $request): RedirectResponse
    {
        return $this->storeRecord($request);
    }

    public function update(RentMachineDetailRequest $request, RentMachineDetail $rentMachineDetail): RedirectResponse
    {
        return $this->updateRecord($request, $rentMachineDetail);
    }

    public function destroy(Request $request, RentMachineDetail $rentMachineDetail): RedirectResponse
    {
        return $this->destroyRecord($request, $rentMachineDetail);
    }
}
