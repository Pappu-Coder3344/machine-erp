<?php

namespace Database\Seeders;

use App\Models\Shift;
use Illuminate\Database\Seeder;

class ShiftSeeder extends Seeder
{
    public function run(): void
    {
        $shifts = [
            [
                'code' => 'GEN',
                'name' => 'General',
                'start_time' => '09:00:00',
                'end_time' => '18:00:00',
                'description' => 'General office and management support shift.',
                'is_active' => true,
            ],
            [
                'code' => 'A',
                'name' => 'Shift A',
                'start_time' => '06:00:00',
                'end_time' => '14:00:00',
                'description' => 'Morning production and maintenance shift.',
                'is_active' => true,
            ],
            [
                'code' => 'B',
                'name' => 'Shift B',
                'start_time' => '14:00:00',
                'end_time' => '22:00:00',
                'description' => 'Evening production and support shift.',
                'is_active' => true,
            ],
        ];

        foreach ($shifts as $shift) {
            Shift::updateOrCreate(
                ['code' => $shift['code']],
                $shift
            );
        }
    }
}
