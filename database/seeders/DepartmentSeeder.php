<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            [
                'code' => 'SYS',
                'name' => 'System Admin',
                'description' => 'Application administration, access management, and control.',
                'is_active' => true,
            ],
            [
                'code' => 'MNT',
                'name' => 'Maintenance',
                'description' => 'Machine maintenance, PM, and corrective support.',
                'is_active' => true,
            ],
            [
                'code' => 'PROD',
                'name' => 'Production',
                'description' => 'Production floor operations and line ownership.',
                'is_active' => true,
            ],
            [
                'code' => 'STORE',
                'name' => 'Store',
                'description' => 'Spare parts stock control and material movement.',
                'is_active' => true,
            ],
            [
                'code' => 'IE',
                'name' => 'IE',
                'description' => 'Industrial engineering review, efficiency, and downtime analytics.',
                'is_active' => true,
            ],
        ];

        foreach ($departments as $department) {
            Department::updateOrCreate(
                ['code' => $department['code']],
                $department
            );
        }
    }
}
