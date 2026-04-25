<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Crud\CrudController;
use App\Http\Requests\Master\VendorRequest;
use App\Models\Vendor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VendorController extends CrudController
{
    protected string $modelClass = Vendor::class;
    protected string $moduleKey = 'vendors';
    protected string $resourceKey = 'vendors';
    protected string $routeNamePrefix = 'app.masters.vendors';
    protected string $resourceLabel = 'Vendor';
    protected string $resourcePluralLabel = 'Vendors';
    protected string $viewPermission = 'vendors.view';
    protected ?string $createPermission = 'vendors.create';
    protected ?string $updatePermission = 'vendors.update';
    protected array $searchable = ['code', 'name', 'type', 'city', 'contact_person', 'status'];
    protected array $columns = [
        ['label' => 'Code', 'key' => 'code'],
        ['label' => 'Name', 'key' => 'name'],
        ['label' => 'Type', 'key' => 'type'],
        ['label' => 'City', 'key' => 'city'],
        ['label' => 'Status', 'key' => 'status', 'format' => 'badge', 'badge_map' => ['Active' => 'success', 'Pending Approval' => 'warning', 'Inactive' => 'secondary']],
    ];

    public function store(VendorRequest $request): RedirectResponse
    {
        return $this->storeRecord($request);
    }

    public function update(VendorRequest $request, Vendor $vendor): RedirectResponse
    {
        return $this->updateRecord($request, $vendor);
    }

    public function destroy(Request $request, Vendor $vendor): RedirectResponse
    {
        return $this->destroyRecord($request, $vendor);
    }
}
