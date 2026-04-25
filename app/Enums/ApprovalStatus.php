<?php

namespace App\Enums;

enum ApprovalStatus: string
{
    case PENDING = 'Pending';
    case APPROVED = 'Approved';
    case REJECTED = 'Rejected';
}
