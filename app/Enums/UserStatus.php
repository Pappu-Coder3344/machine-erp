<?php

namespace App\Enums;

enum UserStatus: string
{
    case ACTIVE = 'Active';
    case INACTIVE = 'Inactive';
    case LOCKED = 'Locked';
    case PENDING_APPROVAL = 'Pending Approval';
}
