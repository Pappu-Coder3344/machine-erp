<?php

namespace App\Enums;

enum ReturnReplaceStatus: string
{
    case NO_REQUEST = 'No Request';
    case REQUESTED = 'Requested';
    case VENDOR_REVIEW = 'Vendor Review';
    case AGREEMENT_REVIEW = 'Agreement Review';
    case REPLACEMENT_REVIEW = 'Replacement Review';
    case APPROVED = 'Approved';
    case COMPLETED = 'Completed';
}
