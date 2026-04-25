<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Full system administrator with complete access.',
                'is_system' => true,
            ],
            [
                'name' => 'Maintenance Head',
                'slug' => 'maintenance-head',
                'description' => 'Owns maintenance oversight, approvals, and operational review.',
                'is_system' => false,
            ],
            [
                'name' => 'Supervisor',
                'slug' => 'supervisor',
                'description' => 'Supervises breakdown raising, assignment coordination, and floor follow-up.',
                'is_system' => false,
            ],
            [
                'name' => 'Technician',
                'slug' => 'technician',
                'description' => 'Performs technician task updates and PM execution work.',
                'is_system' => false,
            ],
            [
                'name' => 'Production User',
                'slug' => 'production-user',
                'description' => 'Production-side complaint originator with limited review access.',
                'is_system' => false,
            ],
            [
                'name' => 'Store User',
                'slug' => 'store-user',
                'description' => 'Handles spare parts visibility and stock movement posting.',
                'is_system' => false,
            ],
            [
                'name' => 'Production GM',
                'slug' => 'production-gm',
                'description' => 'Management-level production review role.',
                'is_system' => false,
            ],
            [
                'name' => 'Operation GM',
                'slug' => 'operation-gm',
                'description' => 'High-level operational management review role.',
                'is_system' => false,
            ],
            [
                'name' => 'IE Manager',
                'slug' => 'ie-manager',
                'description' => 'Management-level industrial engineering analytics review role.',
                'is_system' => false,
            ],
            [
                'name' => 'IE Executive',
                'slug' => 'ie-executive',
                'description' => 'Read-only industrial engineering analytical visibility role.',
                'is_system' => false,
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['slug' => $role['slug']],
                $role
            );
        }
    }
}
