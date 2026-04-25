<?php

namespace Database\Seeders;

use App\Enums\PmFrequency;
use App\Models\MachineCategory;
use Illuminate\Database\Seeder;

class MachineCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'code' => 'CAT-SN',
                'name' => 'Single Needle',
                'default_pm_frequency' => PmFrequency::WEEKLY->value,
                'description' => 'Single needle sewing machines used in core garment stitching.',
                'is_active' => true,
            ],
            [
                'code' => 'CAT-OL',
                'name' => 'Overlock',
                'default_pm_frequency' => PmFrequency::WEEKLY->value,
                'description' => 'Overlock machines used for edge finishing and seam support.',
                'is_active' => true,
            ],
            [
                'code' => 'CAT-FL',
                'name' => 'Flatlock',
                'default_pm_frequency' => PmFrequency::MONTHLY->value,
                'description' => 'Flatlock machines for knit and hem support operations.',
                'is_active' => true,
            ],
            [
                'code' => 'CAT-BA',
                'name' => 'Button Attach',
                'default_pm_frequency' => PmFrequency::MONTHLY->value,
                'description' => 'Button attach machine category for finishing and trim operations.',
                'is_active' => true,
            ],
            [
                'code' => 'CAT-BH',
                'name' => 'Button Hole',
                'default_pm_frequency' => PmFrequency::MONTHLY->value,
                'description' => 'Button hole machine category for garment finishing support.',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            MachineCategory::updateOrCreate(
                ['code' => $category['code']],
                $category
            );
        }
    }
}
