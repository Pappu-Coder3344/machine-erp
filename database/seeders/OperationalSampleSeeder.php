<?php

namespace Database\Seeders;

use App\Enums\ApprovalStatus;
use App\Enums\BreakdownPriority;
use App\Enums\BreakdownTicketStatus;
use App\Enums\MachineOwnershipType;
use App\Enums\MachineStatus;
use App\Enums\PmFrequency;
use App\Enums\PmStatus;
use App\Enums\ReturnReplaceStatus;
use App\Enums\ReturnReplaceType;
use App\Enums\StockMovementType;
use App\Models\Agreement;
use App\Models\ApprovalRequest;
use App\Models\BreakdownTicket;
use App\Models\BreakdownTicketUpdate;
use App\Models\Floor;
use App\Models\Line;
use App\Models\Machine;
use App\Models\MachineAllocation;
use App\Models\MachineCategory;
use App\Models\MachineEvent;
use App\Models\PmExecution;
use App\Models\PmExecutionItem;
use App\Models\PmPlan;
use App\Models\RentMachineDetail;
use App\Models\ReturnReplaceRequest;
use App\Models\SparePart;
use App\Models\StockMovement;
use App\Models\User;
use App\Models\Vendor;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OperationalSampleSeeder extends Seeder
{
    public function run(): void
    {
        $vendor001 = Vendor::updateOrCreate(
            ['code' => 'VEN-001'],
            [
                'name' => 'ABC Sewing Support',
                'type' => 'Rent Machine Vendor',
                'city' => 'Dhaka',
                'contact_person' => 'Md. Kamal Hossain',
                'contact_role' => 'Service Coordinator',
                'phone' => '01711456789',
                'email' => 'abc.support@email.com',
                'status' => 'Active',
                'response_hours' => 6,
                'notes' => 'Primary rent machine support partner for sewing floor coverage.',
            ]
        );

        $vendor004 = Vendor::updateOrCreate(
            ['code' => 'VEN-004'],
            [
                'name' => 'Prime Machine Service',
                'type' => 'Rent Machine Vendor',
                'city' => 'Gazipur',
                'contact_person' => 'Shafiqur Rahman',
                'contact_role' => 'Manager - Rental Support',
                'phone' => '01819225577',
                'office_phone' => '028899112',
                'email' => 'prime.service@email.com',
                'address' => 'House 18, Block C, Tongi Industrial Area, Gazipur, Bangladesh',
                'status' => 'Active',
                'response_hours' => 12,
                'notes' => 'Used for temporary bridging and high-load support machines.',
            ]
        );

        $vendor006 = Vendor::updateOrCreate(
            ['code' => 'VEN-006'],
            [
                'name' => 'Metro Tech Engineering',
                'type' => 'Rent Machine Vendor',
                'city' => 'Narayanganj',
                'contact_person' => 'Habibur Rahman',
                'contact_role' => 'Support Lead',
                'phone' => '01913556677',
                'email' => 'metro.tech@email.com',
                'status' => 'Active',
                'response_hours' => 8,
                'notes' => 'Secondary support vendor for flatlock and line-balancing needs.',
            ]
        );

        $vendor008 = Vendor::updateOrCreate(
            ['code' => 'VEN-008'],
            [
                'name' => 'Golden Parts Center',
                'type' => 'Spare Parts Vendor',
                'city' => 'Dhaka',
                'contact_person' => 'Faruk Hossain',
                'contact_role' => 'Parts Supply Manager',
                'phone' => '01718336699',
                'email' => 'golden.parts@email.com',
                'status' => 'Pending Approval',
                'response_hours' => 24,
                'notes' => 'Critical parts source for overlock and flatlock machine components.',
            ]
        );

        $agreement001 = Agreement::updateOrCreate(
            ['code' => 'AGR-2026-001'],
            [
                'vendor_id' => $vendor001->id,
                'type' => 'Rent Machine',
                'start_date' => '2026-01-01',
                'end_date' => '2026-12-31',
                'coverage' => '14 Rent Machines',
                'monthly_cost' => 180000,
                'status' => 'Active',
                'renewal_risk' => 'Low',
                'terms' => 'Standard rent machine coverage with service response within 6 hours.',
                'notes' => 'Main annual agreement for base rent machine pool.',
            ]
        );

        $agreement004 = Agreement::updateOrCreate(
            ['code' => 'AGR-2026-004'],
            [
                'vendor_id' => $vendor004->id,
                'type' => 'Rent Machine',
                'start_date' => '2026-02-01',
                'end_date' => '2026-05-15',
                'coverage' => '18 Rent Machines',
                'monthly_cost' => 245000,
                'status' => 'Expiring Soon',
                'renewal_risk' => 'High',
                'terms' => 'Short-cycle bridging contract with replacement support on request.',
                'notes' => 'Agreement is under management watch because of renewal dependency.',
            ]
        );

        $agreement006 = Agreement::updateOrCreate(
            ['code' => 'AGR-2026-006'],
            [
                'vendor_id' => $vendor006->id,
                'type' => 'Rent Machine',
                'start_date' => '2026-02-10',
                'end_date' => '2026-12-31',
                'coverage' => '9 Rent Machines',
                'monthly_cost' => 118000,
                'status' => 'Active',
                'renewal_risk' => 'Low',
                'terms' => 'Secondary vendor agreement for flatlock and support machines.',
                'notes' => 'Used where alternate support is required within one shift.',
            ]
        );

        $agreement008 = Agreement::updateOrCreate(
            ['code' => 'AGR-2026-008'],
            [
                'vendor_id' => $vendor008->id,
                'type' => 'Spare Parts Supply',
                'start_date' => '2026-03-01',
                'end_date' => '2026-12-31',
                'coverage' => 'Critical Overlock and Flatlock Parts',
                'monthly_cost' => 64000,
                'status' => 'Draft',
                'renewal_risk' => 'Approval Pending',
                'terms' => 'Critical spare sourcing on approved store requests only.',
                'notes' => 'Pending final approval for higher-value critical part coverage.',
            ]
        );

        $floorS02 = Floor::query()->where('code', 'FLR-S02')->firstOrFail();
        $floorS03 = Floor::query()->where('code', 'FLR-S03')->firstOrFail();
        $line01 = Line::query()->where('code', 'LINE-01')->firstOrFail();
        $line03 = Line::query()->where('code', 'LINE-03')->firstOrFail();
        $line05 = Line::query()->where('code', 'LINE-05')->firstOrFail();
        $line07 = Line::query()->where('code', 'LINE-07')->firstOrFail();
        $line10 = Line::query()->where('code', 'LINE-10')->firstOrFail();

        $singleNeedle = MachineCategory::query()->where('code', 'CAT-SN')->firstOrFail();
        $overlock = MachineCategory::query()->where('code', 'CAT-OL')->firstOrFail();
        $flatlock = MachineCategory::query()->where('code', 'CAT-FL')->firstOrFail();
        $buttonAttach = MachineCategory::query()->where('code', 'CAT-BA')->firstOrFail();

        $machineMc1001 = Machine::updateOrCreate(
            ['code' => 'MC-1001'],
            [
                'machine_category_id' => $singleNeedle->id,
                'floor_id' => $floorS02->id,
                'line_id' => $line01->id,
                'name' => 'Single Needle Machine',
                'brand' => 'Juki',
                'model' => 'DDL-9000C',
                'serial_no' => 'JK-24-1108-7781',
                'ownership_type' => MachineOwnershipType::OWN->value,
                'current_status' => MachineStatus::ACTIVE->value,
                'criticality' => 'A',
                'repeat_watch' => false,
                'installed_at' => '2024-08-12',
                'remarks' => 'Core production machine for Line 01.',
            ]
        );

        $machineMc1014 = Machine::updateOrCreate(
            ['code' => 'MC-1014'],
            [
                'machine_category_id' => $overlock->id,
                'floor_id' => $floorS02->id,
                'line_id' => $line03->id,
                'name' => 'Overlock Machine',
                'brand' => 'Juki',
                'model' => 'MO-6714S',
                'serial_no' => 'JK-OL-1014-4412',
                'ownership_type' => MachineOwnershipType::OWN->value,
                'current_status' => MachineStatus::BREAKDOWN->value,
                'criticality' => 'A',
                'repeat_watch' => true,
                'installed_at' => '2024-10-04',
                'remarks' => 'Under repeat issue watch because of recent thread break pattern.',
            ]
        );

        $machineMc1050 = Machine::updateOrCreate(
            ['code' => 'MC-1050'],
            [
                'machine_category_id' => $buttonAttach->id,
                'floor_id' => $floorS03->id,
                'line_id' => $line10->id,
                'name' => 'Button Attach Machine',
                'brand' => 'Brother',
                'model' => 'BE-438HX',
                'serial_no' => 'BT-1050-3391',
                'ownership_type' => MachineOwnershipType::OWN->value,
                'current_status' => MachineStatus::ACTIVE->value,
                'criticality' => 'B',
                'repeat_watch' => false,
                'installed_at' => '2025-01-15',
                'remarks' => 'Stable finishing support machine.',
            ]
        );

        $machineRm2008 = Machine::updateOrCreate(
            ['code' => 'RM-2008'],
            [
                'machine_category_id' => $overlock->id,
                'floor_id' => $floorS02->id,
                'line_id' => $line03->id,
                'name' => 'Overlock Machine',
                'brand' => 'Juki',
                'model' => 'MO-6714S',
                'serial_no' => 'JUK-RM-6714S-2208',
                'ownership_type' => MachineOwnershipType::RENT->value,
                'current_status' => MachineStatus::UNDER_MAINTENANCE->value,
                'criticality' => 'A',
                'repeat_watch' => true,
                'installed_at' => '2026-02-02',
                'remarks' => 'Rent machine under repeat issue review on Line 03.',
            ]
        );

        $machineRm2010 = Machine::updateOrCreate(
            ['code' => 'RM-2010'],
            [
                'machine_category_id' => $singleNeedle->id,
                'floor_id' => $floorS02->id,
                'line_id' => $line05->id,
                'name' => 'Single Needle Machine',
                'brand' => 'Jack',
                'model' => 'A4E',
                'serial_no' => 'JK-RM-2010-9912',
                'ownership_type' => MachineOwnershipType::RENT->value,
                'current_status' => MachineStatus::ACTIVE->value,
                'criticality' => 'A',
                'repeat_watch' => true,
                'installed_at' => '2026-02-10',
                'remarks' => 'Critical rent machine supporting line balancing needs.',
            ]
        );

        $machineRm2022 = Machine::updateOrCreate(
            ['code' => 'RM-2022'],
            [
                'machine_category_id' => $flatlock->id,
                'floor_id' => $floorS03->id,
                'line_id' => $line10->id,
                'name' => 'Flatlock Machine',
                'brand' => 'Pegasus',
                'model' => 'W664',
                'serial_no' => 'PG-RM-2022-6604',
                'ownership_type' => MachineOwnershipType::RENT->value,
                'current_status' => MachineStatus::ACTIVE->value,
                'criticality' => 'B',
                'repeat_watch' => false,
                'installed_at' => '2026-04-10',
                'remarks' => 'Recently received rent machine for support capacity.',
            ]
        );

        RentMachineDetail::updateOrCreate(
            ['machine_id' => $machineRm2008->id],
            [
                'vendor_id' => $vendor004->id,
                'agreement_id' => $agreement004->id,
                'asset_tag' => 'RT-08',
                'receive_date' => '2026-02-02',
                'monthly_rent' => 14500,
                'return_replace_status' => ReturnReplaceStatus::REPLACEMENT_REVIEW->value,
                'contract_notes' => 'Currently under replacement review due to repeat overlock issue.',
            ]
        );

        RentMachineDetail::updateOrCreate(
            ['machine_id' => $machineRm2010->id],
            [
                'vendor_id' => $vendor004->id,
                'agreement_id' => $agreement004->id,
                'asset_tag' => 'RT-10',
                'receive_date' => '2026-02-10',
                'monthly_rent' => 13800,
                'return_replace_status' => ReturnReplaceStatus::AGREEMENT_REVIEW->value,
                'contract_notes' => 'Agreement review required before return decision.',
            ]
        );

        RentMachineDetail::updateOrCreate(
            ['machine_id' => $machineRm2022->id],
            [
                'vendor_id' => $vendor006->id,
                'agreement_id' => $agreement006->id,
                'asset_tag' => 'RT-22',
                'receive_date' => '2026-04-10',
                'monthly_rent' => 13200,
                'return_replace_status' => ReturnReplaceStatus::NO_REQUEST->value,
                'contract_notes' => 'Freshly received support machine with no open dependency.',
            ]
        );

        $storeCoordinator = User::query()->where('username', 'store.coord')->firstOrFail();
        $supervisor = User::query()->where('username', 'sup.line03')->firstOrFail();
        $maintenanceHead = User::query()->where('username', 'mhead01')->firstOrFail();
        $technicianRana = User::query()->where('username', 'tech.rana')->firstOrFail();
        $technicianRafiq = User::query()->where('username', 'tech.rafiq')->firstOrFail();
        $technicianHasan = User::query()->where('username', 'tech.hasan')->firstOrFail();
        $technicianShamim = User::query()->where('username', 'tech.shamim')->firstOrFail();
        $productionUser = User::query()->where('username', 'prod.user01')->firstOrFail();
        $operationGm = User::query()->where('username', 'gm.ops')->firstOrFail();

        $allocationRm2008 = MachineAllocation::updateOrCreate(
            [
                'machine_id' => $machineRm2008->id,
                'allocated_at' => Carbon::parse('2026-04-18 09:15:00'),
            ],
            [
                'from_floor_id' => $floorS03->id,
                'from_line_id' => $line10->id,
                'to_floor_id' => $floorS02->id,
                'to_line_id' => $line03->id,
                'allocated_by_user_id' => $supervisor->id,
                'allocation_type' => 'Reallocation',
                'reason' => 'Protect overlock output during export batch run.',
                'status' => 'Active',
                'remarks' => 'Shifted from Line 10 to Line 03 for operational support.',
            ]
        );

        MachineAllocation::updateOrCreate(
            [
                'machine_id' => $machineRm2022->id,
                'allocated_at' => Carbon::parse('2026-04-10 09:20:00'),
            ],
            [
                'from_floor_id' => null,
                'from_line_id' => null,
                'to_floor_id' => $floorS03->id,
                'to_line_id' => $line10->id,
                'allocated_by_user_id' => $storeCoordinator->id,
                'allocation_type' => 'Allocation',
                'reason' => 'Newly received rent machine deployed for capacity support.',
                'status' => 'Active',
                'remarks' => 'Receive entry completed before first line allocation.',
            ]
        );

        $ticket0119 = BreakdownTicket::updateOrCreate(
            ['code' => 'BD-2026-0119'],
            [
                'machine_id' => $machineRm2008->id,
                'floor_id' => $floorS02->id,
                'line_id' => $line03->id,
                'raised_by_user_id' => $supervisor->id,
                'assigned_to_user_id' => $technicianRana->id,
                'closed_by_user_id' => null,
                'production_accepted_by_user_id' => null,
                'issue_summary' => 'Repeat thread break and looper timing drift',
                'issue_details' => 'Line 03 overlock support machine showing repeat thread break after corrective reset.',
                'priority' => BreakdownPriority::HIGH->value,
                'status' => BreakdownTicketStatus::IN_PROGRESS->value,
                'impact_summary' => 'Output loss risk on Line 03',
                'root_cause' => 'Looper timing drift under continuous load.',
                'corrective_action' => 'Timing reset and spring check completed, trial run still under watch.',
                'preventive_action' => 'Weekly alignment verification and vendor follow-up.',
                'escalation_status' => 'Vendor Pending',
                'downtime_minutes' => 96,
                'reported_at' => Carbon::parse('2026-04-22 10:05:00'),
                'assigned_at' => Carbon::parse('2026-04-22 10:18:00'),
                'completed_at' => null,
                'closed_at' => null,
                'vendor_support_required' => true,
                'spare_support_required' => true,
                'accepted_by_production' => false,
                'production_accepted_at' => null,
            ]
        );

        $ticket0121 = BreakdownTicket::updateOrCreate(
            ['code' => 'BD-2026-0121'],
            [
                'machine_id' => $machineMc1014->id,
                'floor_id' => $floorS02->id,
                'line_id' => $line03->id,
                'raised_by_user_id' => $productionUser->id,
                'assigned_to_user_id' => null,
                'closed_by_user_id' => null,
                'production_accepted_by_user_id' => null,
                'issue_summary' => 'Looper issue and thread break',
                'issue_details' => 'Production reported repeat thread break during active line output.',
                'priority' => BreakdownPriority::HIGH->value,
                'status' => BreakdownTicketStatus::OPEN->value,
                'impact_summary' => 'Line stoppage risk',
                'root_cause' => 'Pending technician review',
                'corrective_action' => 'Assignment pending',
                'preventive_action' => 'Escalate repeat issue review after inspection',
                'escalation_status' => 'Maintenance Head Review',
                'downtime_minutes' => 48,
                'reported_at' => Carbon::parse('2026-04-23 09:40:00'),
                'assigned_at' => null,
                'completed_at' => null,
                'closed_at' => null,
                'vendor_support_required' => false,
                'spare_support_required' => false,
                'accepted_by_production' => false,
                'production_accepted_at' => null,
            ]
        );

        $ticket0107 = BreakdownTicket::updateOrCreate(
            ['code' => 'BD-2026-0107'],
            [
                'machine_id' => $machineMc1001->id,
                'floor_id' => $floorS02->id,
                'line_id' => $line01->id,
                'raised_by_user_id' => $productionUser->id,
                'assigned_to_user_id' => $technicianRafiq->id,
                'closed_by_user_id' => $maintenanceHead->id,
                'production_accepted_by_user_id' => $supervisor->id,
                'issue_summary' => 'Fabric feeding uneven',
                'issue_details' => 'Feed movement became uneven during style change support.',
                'priority' => BreakdownPriority::MEDIUM->value,
                'status' => BreakdownTicketStatus::CLOSED->value,
                'impact_summary' => 'Minor quality risk',
                'root_cause' => 'Feed dog wear',
                'corrective_action' => 'Feed dog alignment completed and trial run confirmed.',
                'preventive_action' => 'Weekly wear check in PM.',
                'escalation_status' => 'None',
                'downtime_minutes' => 66,
                'reported_at' => Carbon::parse('2026-04-20 09:20:00'),
                'assigned_at' => Carbon::parse('2026-04-20 09:32:00'),
                'completed_at' => Carbon::parse('2026-04-20 10:18:00'),
                'closed_at' => Carbon::parse('2026-04-20 10:26:00'),
                'vendor_support_required' => false,
                'spare_support_required' => false,
                'accepted_by_production' => true,
                'production_accepted_at' => Carbon::parse('2026-04-20 10:24:00'),
            ]
        );

        BreakdownTicketUpdate::updateOrCreate(
            [
                'breakdown_ticket_id' => $ticket0119->id,
                'logged_at' => Carbon::parse('2026-04-22 10:32:00'),
            ],
            [
                'updated_by_user_id' => $technicianRana->id,
                'updated_role_snapshot' => 'Technician',
                'status_snapshot' => 'Accepted',
                'next_step' => 'Inspect looper drive play and run trial pieces.',
                'support_need' => 'No extra support yet',
                'work_note' => 'Reached line and inspected looper timing, spring tension, and thread path condition.',
                'handover_note' => 'Continue watch if closure is not possible in current shift.',
            ]
        );

        BreakdownTicketUpdate::updateOrCreate(
            [
                'breakdown_ticket_id' => $ticket0119->id,
                'logged_at' => Carbon::parse('2026-04-22 10:58:00'),
            ],
            [
                'updated_by_user_id' => $technicianRana->id,
                'updated_role_snapshot' => 'Technician',
                'status_snapshot' => 'In Progress',
                'next_step' => 'Run monitored trial pieces for 30 minutes.',
                'support_need' => 'Spare and vendor watch',
                'work_note' => 'Looper timing reset completed and spring check performed. Repeat vibration still observed at higher speed.',
                'handover_note' => 'Escalate to vendor if repeat observation continues.',
            ]
        );

        BreakdownTicketUpdate::updateOrCreate(
            [
                'breakdown_ticket_id' => $ticket0119->id,
                'logged_at' => Carbon::parse('2026-04-22 11:22:00'),
            ],
            [
                'updated_by_user_id' => $supervisor->id,
                'updated_role_snapshot' => 'Supervisor',
                'status_snapshot' => 'Review',
                'next_step' => 'Confirm production acceptance after monitored run.',
                'support_need' => 'Production acceptance pending',
                'work_note' => 'Trial pieces accepted visually, but maintenance asked to keep the machine under watch before closure.',
                'handover_note' => 'Keep line backup ready if output becomes unstable.',
            ]
        );

        $pm041 = PmPlan::updateOrCreate(
            ['code' => 'PM-2026-041'],
            [
                'machine_id' => $machineMc1001->id,
                'assigned_to_user_id' => $technicianRafiq->id,
                'frequency' => PmFrequency::WEEKLY->value,
                'last_pm_date' => '2026-04-13',
                'next_due_date' => '2026-04-20',
                'status' => PmStatus::COMPLETED->value,
                'exception_reason' => null,
                'vendor_aware' => false,
                'defer_requested' => false,
                'notes' => 'Weekly sewing stability check plan.',
            ]
        );

        $pm043 = PmPlan::updateOrCreate(
            ['code' => 'PM-2026-043'],
            [
                'machine_id' => $machineRm2010->id,
                'assigned_to_user_id' => $technicianHasan->id,
                'frequency' => PmFrequency::MONTHLY->value,
                'last_pm_date' => '2026-03-10',
                'next_due_date' => '2026-04-10',
                'status' => PmStatus::OVERDUE->value,
                'exception_reason' => 'Motor belt shortage delayed safe completion.',
                'vendor_aware' => true,
                'defer_requested' => true,
                'notes' => 'Monthly PM held under store and vendor dependency.',
            ]
        );

        $pm044 = PmPlan::updateOrCreate(
            ['code' => 'PM-2026-044'],
            [
                'machine_id' => $machineMc1050->id,
                'assigned_to_user_id' => $technicianShamim->id,
                'frequency' => PmFrequency::WEEKLY->value,
                'last_pm_date' => '2026-04-10',
                'next_due_date' => '2026-04-17',
                'status' => PmStatus::DUE->value,
                'exception_reason' => null,
                'vendor_aware' => false,
                'defer_requested' => false,
                'notes' => 'Weekly finishing machine pressure line inspection.',
            ]
        );

        $pmExecution041 = PmExecution::updateOrCreate(
            [
                'pm_plan_id' => $pm041->id,
                'execution_date' => '2026-04-20',
            ],
            [
                'executed_by_user_id' => $technicianRafiq->id,
                'approved_by_user_id' => $maintenanceHead->id,
                'start_time' => '09:05:00',
                'end_time' => '09:45:00',
                'status' => PmStatus::COMPLETED->value,
                'machine_condition' => 'Stable',
                'spare_use_note' => 'No spare used',
                'observation_note' => 'Feed movement stable after lubrication and pressure check.',
                'completion_summary' => 'Weekly PM completed and line trial confirmed stable seam output.',
                'next_due_date' => '2026-04-27',
                'approved_at' => Carbon::parse('2026-04-20 11:10:00'),
            ]
        );

        PmExecutionItem::updateOrCreate(
            [
                'pm_execution_id' => $pmExecution041->id,
                'item_name' => 'Needle area cleaning',
            ],
            [
                'checklist_group' => 'Cleaning',
                'observation' => 'Lint cleaned and thread path cleared.',
                'status' => 'Done',
                'sequence' => 1,
            ]
        );

        PmExecutionItem::updateOrCreate(
            [
                'pm_execution_id' => $pmExecution041->id,
                'item_name' => 'Lubrication check',
            ],
            [
                'checklist_group' => 'Lubrication',
                'observation' => 'Oil line stable and movement smooth.',
                'status' => 'Done',
                'sequence' => 2,
            ]
        );

        PmExecutionItem::updateOrCreate(
            [
                'pm_execution_id' => $pmExecution041->id,
                'item_name' => 'Trial run verification',
            ],
            [
                'checklist_group' => 'Validation',
                'observation' => 'Five-piece trial passed with acceptable stitch quality.',
                'status' => 'Done',
                'sequence' => 3,
            ]
        );

        $returnReplace = ReturnReplaceRequest::updateOrCreate(
            ['code' => 'RR-2026-0007'],
            [
                'machine_id' => $machineRm2008->id,
                'vendor_id' => $vendor004->id,
                'agreement_id' => $agreement004->id,
                'line_id' => $line03->id,
                'requested_by_user_id' => $maintenanceHead->id,
                'approved_by_user_id' => null,
                'request_type' => ReturnReplaceType::REPLACEMENT->value,
                'flow_status' => ReturnReplaceStatus::VENDOR_REVIEW->value,
                'approval_stage' => 'Limited management review pending',
                'reference_code' => 'BD-2026-0119',
                'request_date' => '2026-04-21',
                'vendor_reply_date' => '2026-04-22',
                'completion_target' => '2026-04-24',
                'line_impact' => 'Line 03 overlock support is unstable during export batch.',
                'alternate_support' => 'Shift one standby overlock from Line 10 if vendor misses target.',
                'reason' => 'Repeat looper timing issue and thread break after multiple support attempts.',
                'remarks' => 'Vendor asked for one final monitored run before dispatching replacement.',
            ]
        );

        $spareLooper = SparePart::updateOrCreate(
            ['code' => 'SP-001'],
            [
                'machine_category_id' => $overlock->id,
                'vendor_id' => $vendor008->id,
                'name' => 'Looper Set',
                'unit' => 'set',
                'stock_quantity' => 2,
                'reorder_level' => 3,
                'status' => 'Critical',
                'rack_location' => 'Rack A-03',
                'notes' => 'Critical item for repeat overlock issue correction.',
            ]
        );

        $spareMotorBelt = SparePart::updateOrCreate(
            ['code' => 'SP-002'],
            [
                'machine_category_id' => $singleNeedle->id,
                'vendor_id' => $vendor008->id,
                'name' => 'Motor Belt',
                'unit' => 'pcs',
                'stock_quantity' => 4,
                'reorder_level' => 5,
                'status' => 'Low',
                'rack_location' => 'Rack B-01',
                'notes' => 'Low stock item affecting overdue PM completion.',
            ]
        );

        $spareNeedlePlate = SparePart::updateOrCreate(
            ['code' => 'SP-003'],
            [
                'machine_category_id' => $singleNeedle->id,
                'vendor_id' => $vendor008->id,
                'name' => 'Needle Plate',
                'unit' => 'pcs',
                'stock_quantity' => 12,
                'reorder_level' => 4,
                'status' => 'Healthy',
                'rack_location' => 'Rack B-04',
                'notes' => 'Standard sewing machine spare for routine maintenance.',
            ]
        );

        DB::table('spare_part_machine_links')->updateOrInsert(
            [
                'spare_part_id' => $spareLooper->id,
                'machine_id' => $machineRm2008->id,
            ],
            [
                'notes' => 'Primary correction part for repeat looper timing support.',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        DB::table('spare_part_machine_links')->updateOrInsert(
            [
                'spare_part_id' => $spareLooper->id,
                'machine_id' => $machineMc1014->id,
            ],
            [
                'notes' => 'Repeat issue backup fitment for own overlock machine.',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        DB::table('spare_part_machine_links')->updateOrInsert(
            [
                'spare_part_id' => $spareMotorBelt->id,
                'machine_id' => $machineRm2010->id,
            ],
            [
                'notes' => 'Monthly PM blocker when stock falls below reorder level.',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        DB::table('spare_part_machine_links')->updateOrInsert(
            [
                'spare_part_id' => $spareNeedlePlate->id,
                'machine_id' => $machineMc1001->id,
            ],
            [
                'notes' => 'Routine sewing support stock linkage.',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $stockReceive = StockMovement::updateOrCreate(
            ['code' => 'STM-2026-0001'],
            [
                'spare_part_id' => $spareLooper->id,
                'posted_by_user_id' => $storeCoordinator->id,
                'movement_type' => StockMovementType::RECEIVE->value,
                'reference_code' => 'GRN-2026-0042',
                'quantity' => 5,
                'balance_after' => 7,
                'movement_date' => Carbon::parse('2026-04-14 11:00:00'),
                'status' => 'Posted',
                'note' => 'Emergency looper set received against critical overlock requirement.',
            ]
        );

        StockMovement::updateOrCreate(
            ['code' => 'STM-2026-0002'],
            [
                'spare_part_id' => $spareMotorBelt->id,
                'posted_by_user_id' => $storeCoordinator->id,
                'movement_type' => StockMovementType::ISSUE->value,
                'reference_code' => 'PM-2026-043',
                'quantity' => 1,
                'balance_after' => 3,
                'movement_date' => Carbon::parse('2026-04-18 02:15:00'),
                'status' => 'Posted',
                'note' => 'Emergency PM issue posted for rent machine belt replacement.',
            ]
        );

        $stockAdjust = StockMovement::updateOrCreate(
            ['code' => 'STM-2026-0003'],
            [
                'spare_part_id' => $spareNeedlePlate->id,
                'posted_by_user_id' => $storeCoordinator->id,
                'movement_type' => StockMovementType::ADJUSTMENT->value,
                'reference_code' => 'ADJ-2026-0011',
                'quantity' => -1,
                'balance_after' => 11,
                'movement_date' => Carbon::parse('2026-04-19 05:30:00'),
                'status' => 'Adjusted',
                'note' => 'Cycle count adjustment after rack verification.',
            ]
        );

        ApprovalRequest::updateOrCreate(
            ['code' => 'APR-2026-0007'],
            [
                'requested_by_user_id' => $maintenanceHead->id,
                'approver_user_id' => $operationGm->id,
                'breakdown_ticket_id' => null,
                'pm_plan_id' => null,
                'return_replace_request_id' => $returnReplace->id,
                'stock_movement_id' => null,
                'spare_part_id' => null,
                'module' => 'Return / Replace',
                'request_type' => 'Replacement Approval',
                'status' => ApprovalStatus::PENDING->value,
                'note' => 'Operational approval requested because line output is at risk.',
                'requested_at' => Carbon::parse('2026-04-21 04:45:00'),
                'approved_at' => null,
            ]
        );

        ApprovalRequest::updateOrCreate(
            ['code' => 'APR-2026-0008'],
            [
                'requested_by_user_id' => $technicianHasan->id,
                'approver_user_id' => $maintenanceHead->id,
                'breakdown_ticket_id' => null,
                'pm_plan_id' => $pm043->id,
                'return_replace_request_id' => null,
                'stock_movement_id' => $stockAdjust->id,
                'spare_part_id' => $spareMotorBelt->id,
                'module' => 'PM',
                'request_type' => 'PM Defer and Spare Escalation',
                'status' => ApprovalStatus::APPROVED->value,
                'note' => 'Approved defer until stable belt stock is available.',
                'requested_at' => Carbon::parse('2026-04-18 03:00:00'),
                'approved_at' => Carbon::parse('2026-04-18 03:20:00'),
            ]
        );

        MachineEvent::updateOrCreate(
            [
                'machine_id' => $machineRm2008->id,
                'occurred_at' => Carbon::parse('2026-02-02 09:25:00'),
                'event_type' => 'Receive',
            ],
            [
                'updated_by_user_id' => $storeCoordinator->id,
                'breakdown_ticket_id' => null,
                'pm_plan_id' => null,
                'return_replace_request_id' => null,
                'agreement_id' => $agreement004->id,
                'machine_allocation_id' => null,
                'linked_ref_type' => 'Agreement reference',
                'details' => 'Rent machine received, tagged, and linked with vendor and agreement before allocation.',
                'status_after_event' => MachineStatus::ACTIVE->value,
            ]
        );

        MachineEvent::updateOrCreate(
            [
                'machine_id' => $machineRm2008->id,
                'occurred_at' => Carbon::parse('2026-04-18 09:15:00'),
                'event_type' => 'Allocation',
            ],
            [
                'updated_by_user_id' => $supervisor->id,
                'breakdown_ticket_id' => null,
                'pm_plan_id' => null,
                'return_replace_request_id' => null,
                'agreement_id' => null,
                'machine_allocation_id' => $allocationRm2008->id,
                'linked_ref_type' => 'Allocation reference',
                'details' => 'Rent overlock machine reallocated to Line 03 to protect export output.',
                'status_after_event' => MachineStatus::ACTIVE->value,
            ]
        );

        MachineEvent::updateOrCreate(
            [
                'machine_id' => $machineRm2008->id,
                'occurred_at' => Carbon::parse('2026-04-22 10:05:00'),
                'event_type' => 'Breakdown',
            ],
            [
                'updated_by_user_id' => $supervisor->id,
                'breakdown_ticket_id' => $ticket0119->id,
                'pm_plan_id' => null,
                'return_replace_request_id' => null,
                'agreement_id' => null,
                'machine_allocation_id' => null,
                'linked_ref_type' => 'Breakdown ticket',
                'details' => 'Repeat thread break complaint logged after looper timing drift was observed on live line.',
                'status_after_event' => MachineStatus::UNDER_MAINTENANCE->value,
            ]
        );

        MachineEvent::updateOrCreate(
            [
                'machine_id' => $machineMc1001->id,
                'occurred_at' => Carbon::parse('2026-04-20 09:45:00'),
                'event_type' => 'PM Update',
            ],
            [
                'updated_by_user_id' => $technicianRafiq->id,
                'breakdown_ticket_id' => null,
                'pm_plan_id' => $pm041->id,
                'return_replace_request_id' => null,
                'agreement_id' => null,
                'machine_allocation_id' => null,
                'linked_ref_type' => 'PM plan',
                'details' => 'Weekly PM executed and next due date updated after lubrication and trial run verification.',
                'status_after_event' => MachineStatus::ACTIVE->value,
            ]
        );

        MachineEvent::updateOrCreate(
            [
                'machine_id' => $machineRm2008->id,
                'occurred_at' => Carbon::parse('2026-04-21 04:20:00'),
                'event_type' => 'Return / Replace',
            ],
            [
                'updated_by_user_id' => $maintenanceHead->id,
                'breakdown_ticket_id' => null,
                'pm_plan_id' => null,
                'return_replace_request_id' => $returnReplace->id,
                'agreement_id' => $agreement004->id,
                'machine_allocation_id' => null,
                'linked_ref_type' => 'Return / replace request',
                'details' => 'Replacement review opened because repeated corrective support is affecting stable output.',
                'status_after_event' => ReturnReplaceStatus::VENDOR_REVIEW->value,
            ]
        );

        $this->command?->info('Operational sample seed data prepared for maintenance, rent, PM, and spare workflow foundations.');
    }
}
