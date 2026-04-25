<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['module' => 'Dashboard', 'action' => 'View', 'slug' => 'dashboard.view', 'description' => 'View dashboard summaries and alerts.'],
            ['module' => 'Machine Master', 'action' => 'View', 'slug' => 'machine-master.view', 'description' => 'View machine master records.'],
            ['module' => 'Machine Master', 'action' => 'Create', 'slug' => 'machine-master.create', 'description' => 'Create new machine master records.'],
            ['module' => 'Machine Master', 'action' => 'Update', 'slug' => 'machine-master.update', 'description' => 'Edit machine master records.'],
            ['module' => 'Breakdown', 'action' => 'View', 'slug' => 'breakdown.view', 'description' => 'View breakdown ticket lists and details.'],
            ['module' => 'Breakdown', 'action' => 'Create', 'slug' => 'breakdown.create', 'description' => 'Raise new breakdown tickets.'],
            ['module' => 'Breakdown', 'action' => 'Assign', 'slug' => 'breakdown.assign', 'description' => 'Assign breakdown tickets to technicians.'],
            ['module' => 'Breakdown', 'action' => 'Update', 'slug' => 'breakdown.update', 'description' => 'Post technician or workflow updates on breakdown tickets.'],
            ['module' => 'Breakdown', 'action' => 'Close', 'slug' => 'breakdown.close', 'description' => 'Close completed breakdown tickets.'],
            ['module' => 'Breakdown', 'action' => 'Review', 'slug' => 'breakdown.review', 'description' => 'Review breakdown performance and operational impact.'],
            ['module' => 'PM', 'action' => 'View', 'slug' => 'pm.view', 'description' => 'View PM schedules, due lists, and summaries.'],
            ['module' => 'PM', 'action' => 'Plan', 'slug' => 'pm.plan', 'description' => 'Create or update PM plan setup.'],
            ['module' => 'PM', 'action' => 'Execute', 'slug' => 'pm.execute', 'description' => 'Execute PM checklist activities.'],
            ['module' => 'PM', 'action' => 'Complete', 'slug' => 'pm.complete', 'description' => 'Confirm PM completion and closeout.'],
            ['module' => 'PM', 'action' => 'Review', 'slug' => 'pm.review', 'description' => 'Review PM pressure, compliance, and risks.'],
            ['module' => 'Spare Parts', 'action' => 'View', 'slug' => 'spare-parts.view', 'description' => 'View spare stock and usage visibility.'],
            ['module' => 'Spare Parts', 'action' => 'Create', 'slug' => 'spare-parts.create', 'description' => 'Create spare part master records.'],
            ['module' => 'Spare Parts', 'action' => 'Update', 'slug' => 'spare-parts.update', 'description' => 'Update spare part details.'],
            ['module' => 'Spare Parts', 'action' => 'Post', 'slug' => 'spare-parts.post', 'description' => 'Post stock receive, issue, and adjustment entries.'],
            ['module' => 'Reports', 'action' => 'View', 'slug' => 'reports.view', 'description' => 'View management and operational reports.'],
            ['module' => 'Reports', 'action' => 'Export', 'slug' => 'reports.export', 'description' => 'Export report output for management review.'],
            ['module' => 'Vendors', 'action' => 'View', 'slug' => 'vendors.view', 'description' => 'View vendor records and support status.'],
            ['module' => 'Vendors', 'action' => 'Create', 'slug' => 'vendors.create', 'description' => 'Create vendor records.'],
            ['module' => 'Vendors', 'action' => 'Update', 'slug' => 'vendors.update', 'description' => 'Edit vendor records.'],
            ['module' => 'Agreements', 'action' => 'View', 'slug' => 'agreements.view', 'description' => 'View agreement coverage and validity.'],
            ['module' => 'Agreements', 'action' => 'Create', 'slug' => 'agreements.create', 'description' => 'Create agreements.'],
            ['module' => 'Agreements', 'action' => 'Update', 'slug' => 'agreements.update', 'description' => 'Edit agreements.'],
            ['module' => 'Rent Machines', 'action' => 'View', 'slug' => 'rent-machines.view', 'description' => 'View rent machine records and histories.'],
            ['module' => 'Rent Machines', 'action' => 'Receive', 'slug' => 'rent-machines.receive', 'description' => 'Receive rent machines and record linked details.'],
            ['module' => 'Rent Machines', 'action' => 'Update', 'slug' => 'rent-machines.update', 'description' => 'Update rent machine records.'],
            ['module' => 'Allocation', 'action' => 'View', 'slug' => 'allocation.view', 'description' => 'View machine allocation and transfer history.'],
            ['module' => 'Allocation', 'action' => 'Create', 'slug' => 'allocation.create', 'description' => 'Create allocation or transfer entries.'],
            ['module' => 'Return Replace', 'action' => 'View', 'slug' => 'return-replace.view', 'description' => 'View return and replace requests.'],
            ['module' => 'Return Replace', 'action' => 'Create', 'slug' => 'return-replace.create', 'description' => 'Create return or replacement requests.'],
            ['module' => 'Return Replace', 'action' => 'Review', 'slug' => 'return-replace.review', 'description' => 'Review return and replacement dependencies.'],
            ['module' => 'Approval', 'action' => 'View', 'slug' => 'approval.view', 'description' => 'View management approval queue items.'],
            ['module' => 'Approval', 'action' => 'Approve', 'slug' => 'approval.approve', 'description' => 'Approve limited workflow requests.'],
            ['module' => 'Setup', 'action' => 'View', 'slug' => 'setup.view', 'description' => 'View setup masters such as factory, floor, line, and section.'],
            ['module' => 'Setup', 'action' => 'Create', 'slug' => 'setup.create', 'description' => 'Create setup master records.'],
            ['module' => 'Setup', 'action' => 'Update', 'slug' => 'setup.update', 'description' => 'Update setup master records.'],
            ['module' => 'Users', 'action' => 'View', 'slug' => 'users.view', 'description' => 'View user and role records.'],
            ['module' => 'Users', 'action' => 'Create', 'slug' => 'users.create', 'description' => 'Create user records.'],
            ['module' => 'Users', 'action' => 'Update', 'slug' => 'users.update', 'description' => 'Update user records.'],
            ['module' => 'Users', 'action' => 'Approve', 'slug' => 'users.approve', 'description' => 'Approve user actions and access changes.'],
            ['module' => 'Technician Tasks', 'action' => 'View', 'slug' => 'technician-tasks.view', 'description' => 'View technician task board and assigned work.'],
            ['module' => 'Technician Tasks', 'action' => 'Update', 'slug' => 'technician-tasks.update', 'description' => 'Update technician task progress.'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }
    }
}
