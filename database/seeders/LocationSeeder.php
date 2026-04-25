<?php

namespace Database\Seeders;

use App\Models\FactoryUnit;
use App\Models\Floor;
use App\Models\Line;
use App\Models\Section;
use App\Models\Shift;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $generalShift = Shift::query()->where('code', 'GEN')->firstOrFail();
        $shiftA = Shift::query()->where('code', 'A')->firstOrFail();
        $shiftB = Shift::query()->where('code', 'B')->firstOrFail();

        $sewingUnitA = FactoryUnit::query()->where('code', 'UNT-SWA')->firstOrFail();
        $sewingUnitB = FactoryUnit::query()->where('code', 'UNT-SWB')->firstOrFail();

        $floors = [
            [
                'code' => 'FLR-S02',
                'factory_unit_id' => $sewingUnitA->id,
                'shift_id' => $shiftA->id,
                'name' => 'Sewing Floor 02',
                'area_type' => 'Sewing',
                'machine_capacity' => 80,
                'supervisor_name' => 'Rahima Begum',
                'status' => 'Active',
                'sort_order' => 2,
            ],
            [
                'code' => 'FLR-S03',
                'factory_unit_id' => $sewingUnitA->id,
                'shift_id' => $shiftB->id,
                'name' => 'Sewing Floor 03',
                'area_type' => 'Sewing',
                'machine_capacity' => 75,
                'supervisor_name' => 'Jui Sarker',
                'status' => 'Active',
                'sort_order' => 3,
            ],
            [
                'code' => 'FLR-F01',
                'factory_unit_id' => $sewingUnitB->id,
                'shift_id' => $generalShift->id,
                'name' => 'Finishing Floor 01',
                'area_type' => 'Finishing',
                'machine_capacity' => 35,
                'supervisor_name' => 'Mitu Rani',
                'status' => 'Active',
                'sort_order' => 1,
            ],
        ];

        foreach ($floors as $floorData) {
            Floor::updateOrCreate(
                ['code' => $floorData['code']],
                $floorData
            );
        }

        $floorS02 = Floor::query()->where('code', 'FLR-S02')->firstOrFail();
        $floorS03 = Floor::query()->where('code', 'FLR-S03')->firstOrFail();
        $floorF01 = Floor::query()->where('code', 'FLR-F01')->firstOrFail();

        $sections = [
            [
                'code' => 'SEC-S02-A',
                'floor_id' => $floorS02->id,
                'shift_id' => $shiftA->id,
                'name' => 'Sewing Section A',
                'line_group_name' => 'Core Sewing Block',
                'machine_focus' => 'Single Needle, Overlock',
                'in_charge_name' => 'Rahima Begum',
                'status' => 'Active',
                'sort_order' => 1,
            ],
            [
                'code' => 'SEC-S03-A',
                'floor_id' => $floorS03->id,
                'shift_id' => $shiftB->id,
                'name' => 'Sewing Section B',
                'line_group_name' => 'Support Sewing Block',
                'machine_focus' => 'Flatlock, Button Attach',
                'in_charge_name' => 'Jui Sarker',
                'status' => 'Active',
                'sort_order' => 1,
            ],
            [
                'code' => 'SEC-F01-A',
                'floor_id' => $floorF01->id,
                'shift_id' => $generalShift->id,
                'name' => 'Finishing Section',
                'line_group_name' => 'Finishing Support',
                'machine_focus' => 'Pressing and finishing aids',
                'in_charge_name' => 'Mitu Rani',
                'status' => 'Active',
                'sort_order' => 1,
            ],
        ];

        foreach ($sections as $sectionData) {
            Section::updateOrCreate(
                ['code' => $sectionData['code']],
                $sectionData
            );
        }

        $sectionS02A = Section::query()->where('code', 'SEC-S02-A')->firstOrFail();
        $sectionS03A = Section::query()->where('code', 'SEC-S03-A')->firstOrFail();
        $sectionF01A = Section::query()->where('code', 'SEC-F01-A')->firstOrFail();

        $lines = [
            [
                'code' => 'LINE-01',
                'floor_id' => $floorS02->id,
                'section_id' => $sectionS02A->id,
                'shift_id' => $shiftA->id,
                'name' => 'Line 01',
                'machine_capacity' => 24,
                'current_machine_types' => 'Single Needle, Overlock',
                'supervisor_name' => 'Rahima Begum',
                'status' => 'Active',
                'sort_order' => 1,
            ],
            [
                'code' => 'LINE-03',
                'floor_id' => $floorS02->id,
                'section_id' => $sectionS02A->id,
                'shift_id' => $shiftA->id,
                'name' => 'Line 03',
                'machine_capacity' => 26,
                'current_machine_types' => 'Single Needle, Overlock',
                'supervisor_name' => 'Rahima Begum',
                'status' => 'Active',
                'sort_order' => 3,
            ],
            [
                'code' => 'LINE-05',
                'floor_id' => $floorS02->id,
                'section_id' => $sectionS02A->id,
                'shift_id' => $shiftA->id,
                'name' => 'Line 05',
                'machine_capacity' => 22,
                'current_machine_types' => 'Single Needle, Overlock',
                'supervisor_name' => 'Shila Akter',
                'status' => 'Active',
                'sort_order' => 5,
            ],
            [
                'code' => 'LINE-07',
                'floor_id' => $floorS03->id,
                'section_id' => $sectionS03A->id,
                'shift_id' => $shiftB->id,
                'name' => 'Line 07',
                'machine_capacity' => 23,
                'current_machine_types' => 'Flatlock, Overlock',
                'supervisor_name' => 'Jui Sarker',
                'status' => 'Active',
                'sort_order' => 7,
            ],
            [
                'code' => 'LINE-10',
                'floor_id' => $floorS03->id,
                'section_id' => $sectionS03A->id,
                'shift_id' => $shiftB->id,
                'name' => 'Line 10',
                'machine_capacity' => 22,
                'current_machine_types' => 'Single Needle, Button Attach',
                'supervisor_name' => 'Jui Sarker',
                'status' => 'Active',
                'sort_order' => 10,
            ],
            [
                'code' => 'LINE-F01',
                'floor_id' => $floorF01->id,
                'section_id' => $sectionF01A->id,
                'shift_id' => $generalShift->id,
                'name' => 'Finishing Line 01',
                'machine_capacity' => 10,
                'current_machine_types' => 'Finishing Support',
                'supervisor_name' => 'Mitu Rani',
                'status' => 'Active',
                'sort_order' => 1,
            ],
        ];

        foreach ($lines as $lineData) {
            Line::updateOrCreate(
                ['code' => $lineData['code']],
                $lineData
            );
        }
    }
}
