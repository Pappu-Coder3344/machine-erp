<?php

namespace App\Enums;

enum PmFrequency: string
{
    case DAILY = 'Daily';
    case WEEKLY = 'Weekly';
    case MONTHLY = 'Monthly';
}
