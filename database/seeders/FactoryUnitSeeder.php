<?php

namespace Database\Seeders;

use App\Models\FactoryUnit;
use Illuminate\Database\Seeder;

class FactoryUnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            [
                'code' => 'UNT-SWA',
                'name' => 'Sewing Unit A',
                'area_type' => 'Production',
                'address' => 'Konabari Industrial Area, Gazipur, Bangladesh',
                'description' => 'Primary sewing unit for export production lines.',
                'is_active' => true,
            ],
            [
                'code' => 'UNT-SWB',
                'name' => 'Sewing Unit B',
                'area_type' => 'Production',
                'address' => 'Gazipur Bypass Road, Gazipur, Bangladesh',
                'description' => 'Additional sewing and finishing support unit.',
                'is_active' => true,
            ],
            [
                'code' => 'UNT-SUP',
                'name' => 'Support Services Block',
                'area_type' => 'Support',
                'address' => 'Central Utility Compound, Gazipur, Bangladesh',
                'description' => 'Shared support area for store, maintenance, and admin teams.',
                'is_active' => true,
            ],
        ];

        foreach ($units as $unit) {
            FactoryUnit::updateOrCreate(
                ['code' => $unit['code']],
                $unit
            );
        }
    }
}
