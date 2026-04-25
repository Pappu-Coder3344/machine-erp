<?php

namespace App\Enums;

enum BreakdownTicketStatus: string
{
    case OPEN = 'Open';
    case ASSIGNED = 'Assigned';
    case IN_PROGRESS = 'In Progress';
    case COMPLETED = 'Completed';
    case CLOSED = 'Closed';
}
