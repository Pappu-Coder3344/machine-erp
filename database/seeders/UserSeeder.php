<?php

namespace Database\Seeders;

use App\Enums\UserStatus;
use App\Models\Department;
use App\Models\FactoryUnit;
use App\Models\Role;
use App\Models\Shift;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'employee_code' => 'AD-001',
                'name' => 'Mahmud Hasan',
                'username' => 'admin.lml',
                'email' => 'admin@louietex.local',
                'phone' => '01711000001',
                'designation' => 'System Administrator',
                'department' => 'System Admin',
                'shift' => 'GEN',
                'factory_unit' => 'UNT-SUP',
                'role' => 'Admin',
            ],
            [
                'employee_code' => 'MH-001',
                'name' => 'Jahidul Islam',
                'username' => 'mhead01',
                'email' => 'maintenance.head@louietex.local',
                'phone' => '01711000002',
                'designation' => 'Maintenance Head',
                'department' => 'Maintenance',
                'shift' => 'GEN',
                'factory_unit' => 'UNT-SUP',
                'role' => 'Maintenance Head',
            ],
            [
                'employee_code' => 'SUP-003',
                'name' => 'Rahima Begum',
                'username' => 'sup.line03',
                'email' => 'rahima.begum@louietex.local',
                'phone' => '01711000003',
                'designation' => 'Production Supervisor',
                'department' => 'Production',
                'shift' => 'A',
                'factory_unit' => 'UNT-SWA',
                'role' => 'Supervisor',
            ],
            [
                'employee_code' => 'SUP-010',
                'name' => 'Jui Sarker',
                'username' => 'sup.finish02',
                'email' => 'jui.sarker@louietex.local',
                'phone' => '01711000004',
                'designation' => 'Production Supervisor',
                'department' => 'Production',
                'shift' => 'B',
                'factory_unit' => 'UNT-SWA',
                'role' => 'Supervisor',
            ],
            [
                'employee_code' => 'PRD-001',
                'name' => 'Salma Akter',
                'username' => 'prod.user01',
                'email' => 'salma.akter@louietex.local',
                'phone' => '01711000005',
                'designation' => 'Production Executive',
                'department' => 'Production',
                'shift' => 'A',
                'factory_unit' => 'UNT-SWA',
                'role' => 'Production User',
            ],
            [
                'employee_code' => 'TEC-001',
                'name' => 'Sohel Rana',
                'username' => 'tech.rana',
                'email' => 'sohel.rana@louietex.local',
                'phone' => '01711000006',
                'designation' => 'Maintenance Technician',
                'department' => 'Maintenance',
                'shift' => 'A',
                'factory_unit' => 'UNT-SUP',
                'role' => 'Technician',
            ],
            [
                'employee_code' => 'TEC-002',
                'name' => 'Rafiqul Islam',
                'username' => 'tech.rafiq',
                'email' => 'rafiqul.islam@louietex.local',
                'phone' => '01711000007',
                'designation' => 'Maintenance Technician',
                'department' => 'Maintenance',
                'shift' => 'A',
                'factory_unit' => 'UNT-SUP',
                'role' => 'Technician',
            ],
            [
                'employee_code' => 'TEC-003',
                'name' => 'Shamim Mia',
                'username' => 'tech.shamim',
                'email' => 'shamim.mia@louietex.local',
                'phone' => '01711000008',
                'designation' => 'Maintenance Technician',
                'department' => 'Maintenance',
                'shift' => 'B',
                'factory_unit' => 'UNT-SUP',
                'role' => 'Technician',
            ],
            [
                'employee_code' => 'TEC-004',
                'name' => 'Hasan Ali',
                'username' => 'tech.hasan',
                'email' => 'hasan.ali@louietex.local',
                'phone' => '01711000009',
                'designation' => 'Maintenance Technician',
                'department' => 'Maintenance',
                'shift' => 'B',
                'factory_unit' => 'UNT-SUP',
                'role' => 'Technician',
            ],
            [
                'employee_code' => 'STR-001',
                'name' => 'Nasima Akter',
                'username' => 'store.user',
                'email' => 'nasima.akter@louietex.local',
                'phone' => '01711000010',
                'designation' => 'Store Officer',
                'department' => 'Store',
                'shift' => 'GEN',
                'factory_unit' => 'UNT-SUP',
                'role' => 'Store User',
            ],
            [
                'employee_code' => 'STR-002',
                'name' => 'Shahadat Hossain',
                'username' => 'store.coord',
                'email' => 'shahadat.hossain@louietex.local',
                'phone' => '01711000011',
                'designation' => 'Store Coordinator',
                'department' => 'Store',
                'shift' => 'GEN',
                'factory_unit' => 'UNT-SUP',
                'role' => 'Store User',
            ],
            [
                'employee_code' => 'PGM-001',
                'name' => 'Kamrul Hasan',
                'username' => 'gm.prod',
                'email' => 'kamrul.hasan@louietex.local',
                'phone' => '01711000012',
                'designation' => 'Production GM',
                'department' => 'Production',
                'shift' => 'GEN',
                'factory_unit' => 'UNT-SWA',
                'role' => 'Production GM',
            ],
            [
                'employee_code' => 'OGM-001',
                'name' => 'Sabbir Hossain',
                'username' => 'gm.ops',
                'email' => 'sabbir.hossain@louietex.local',
                'phone' => '01711000013',
                'designation' => 'Operation GM',
                'department' => 'Production',
                'shift' => 'GEN',
                'factory_unit' => 'UNT-SWA',
                'role' => 'Operation GM',
            ],
            [
                'employee_code' => 'IEM-001',
                'name' => 'Nusrat Jahan',
                'username' => 'ie.manager',
                'email' => 'nusrat.jahan@louietex.local',
                'phone' => '01711000014',
                'designation' => 'IE Manager',
                'department' => 'IE',
                'shift' => 'GEN',
                'factory_unit' => 'UNT-SWA',
                'role' => 'IE Manager',
            ],
            [
                'employee_code' => 'IEE-001',
                'name' => 'Farhana Sultana',
                'username' => 'ie.executive',
                'email' => 'farhana.sultana@louietex.local',
                'phone' => '01711000015',
                'designation' => 'IE Executive',
                'department' => 'IE',
                'shift' => 'GEN',
                'factory_unit' => 'UNT-SWA',
                'role' => 'IE Executive',
            ],
        ];

        foreach ($users as $userData) {
            $department = Department::query()->where('name', $userData['department'])->firstOrFail();
            $shift = Shift::query()->where('code', $userData['shift'])->firstOrFail();
            $factoryUnit = FactoryUnit::query()->where('code', $userData['factory_unit'])->firstOrFail();
            $role = Role::query()->where('name', $userData['role'])->firstOrFail();

            $user = User::updateOrCreate(
                ['username' => $userData['username']],
                [
                    'employee_code' => $userData['employee_code'],
                    'department_id' => $department->id,
                    'shift_id' => $shift->id,
                    'factory_unit_id' => $factoryUnit->id,
                    'name' => $userData['name'],
                    'email' => $userData['email'],
                    'phone' => $userData['phone'],
                    'designation' => $userData['designation'],
                    'status' => UserStatus::ACTIVE->value,
                    'email_verified_at' => now(),
                    'last_login_at' => now(),
                    'password' => 'password',
                ]
            );

            $user->roles()->sync([$role->id]);
        }
    }
}
