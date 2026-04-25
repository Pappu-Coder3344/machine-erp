<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $allPermissionIds = Permission::query()->pluck('id')->all();

        $rolePermissions = [
            'Admin' => ['*'],
            'Maintenance Head' => [
                'dashboard.view',
                'machine-master.view',
                'machine-master.create',
                'machine-master.update',
                'breakdown.view',
                'breakdown.assign',
                'breakdown.review',
                'breakdown.close',
                'pm.view',
                'pm.plan',
                'pm.review',
                'pm.complete',
                'spare-parts.view',
                'reports.view',
                'reports.export',
                'vendors.view',
                'agreements.view',
                'rent-machines.view',
                'allocation.view',
                'return-replace.view',
                'return-replace.review',
                'approval.view',
                'approval.approve',
                'setup.view',
                'users.view',
                'technician-tasks.view',
            ],
            'Supervisor' => [
                'dashboard.view',
                'machine-master.view',
                'breakdown.view',
                'breakdown.create',
                'breakdown.assign',
                'breakdown.review',
                'pm.view',
                'pm.review',
                'reports.view',
                'rent-machines.view',
                'allocation.view',
                'return-replace.view',
                'return-replace.create',
                'technician-tasks.view',
            ],
            'Technician' => [
                'dashboard.view',
                'machine-master.view',
                'breakdown.view',
                'breakdown.update',
                'pm.view',
                'pm.execute',
                'pm.complete',
                'spare-parts.view',
                'reports.view',
                'technician-tasks.view',
                'technician-tasks.update',
            ],
            'Production User' => [
                'dashboard.view',
                'machine-master.view',
                'breakdown.view',
                'breakdown.create',
                'pm.view',
                'reports.view',
            ],
            'Store User' => [
                'dashboard.view',
                'spare-parts.view',
                'spare-parts.create',
                'spare-parts.update',
                'spare-parts.post',
                'reports.view',
                'vendors.view',
                'agreements.view',
                'rent-machines.view',
                'rent-machines.receive',
                'rent-machines.update',
                'allocation.view',
                'return-replace.view',
            ],
            'Production GM' => [
                'dashboard.view',
                'machine-master.view',
                'breakdown.view',
                'breakdown.review',
                'pm.view',
                'pm.review',
                'spare-parts.view',
                'reports.view',
                'reports.export',
                'vendors.view',
                'agreements.view',
                'rent-machines.view',
                'allocation.view',
                'return-replace.view',
                'return-replace.review',
                'approval.view',
                'approval.approve',
            ],
            'Operation GM' => [
                'dashboard.view',
                'machine-master.view',
                'breakdown.view',
                'breakdown.review',
                'pm.view',
                'pm.review',
                'spare-parts.view',
                'reports.view',
                'reports.export',
                'vendors.view',
                'agreements.view',
                'rent-machines.view',
                'allocation.view',
                'return-replace.view',
                'return-replace.review',
                'approval.view',
                'approval.approve',
            ],
            'IE Manager' => [
                'dashboard.view',
                'machine-master.view',
                'breakdown.view',
                'breakdown.review',
                'pm.view',
                'pm.review',
                'reports.view',
                'reports.export',
            ],
            'IE Executive' => [
                'dashboard.view',
                'machine-master.view',
                'breakdown.view',
                'pm.view',
                'reports.view',
            ],
        ];

        foreach ($rolePermissions as $roleName => $permissionSlugs) {
            $role = Role::query()->where('name', $roleName)->firstOrFail();

            if ($permissionSlugs === ['*']) {
                $role->permissions()->sync($allPermissionIds);
                continue;
            }

            $permissionIds = Permission::query()
                ->whereIn('slug', $permissionSlugs)
                ->pluck('id')
                ->all();

            $role->permissions()->sync($permissionIds);
        }
    }
}
