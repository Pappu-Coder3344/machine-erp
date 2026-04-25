<?php

namespace App\Enums;

enum MachineStatus: string
{
    case ACTIVE = 'Active';
    case IDLE = 'Idle';
    case BREAKDOWN = 'Breakdown';
    case UNDER_MAINTENANCE = 'Under Maintenance';
    case RETURNED = 'Returned';
    case REPLACED = 'Replaced';
}
