<?php

namespace App\Enums;

enum StockMovementType: string
{
    case RECEIVE = 'Receive';
    case ISSUE = 'Issue';
    case PENDING_ISSUE = 'Pending Issue';
    case ADJUSTMENT = 'Adjustment';
    case RETURN = 'Return';
}
