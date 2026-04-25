<?php

namespace App\Enums;

enum PmStatus: string
{
    case PLANNED = 'Planned';
    case DUE = 'Due';
    case OVERDUE = 'Overdue';
    case IN_PROGRESS = 'In Progress';
    case COMPLETED = 'Completed';
}
