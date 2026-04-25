<?php

return [
    'navigation' => [
        'setup' => [
            [
                'label' => 'Departments',
                'route' => 'app.setup.departments.index',
                'permission' => 'setup.view',
            ],
            [
                'label' => 'Shifts',
                'route' => 'app.setup.shifts.index',
                'permission' => 'setup.view',
            ],
            [
                'label' => 'Factory Units',
                'route' => 'app.setup.factory-units.index',
                'permission' => 'setup.view',
            ],
            [
                'label' => 'Floors',
                'route' => 'app.setup.floors.index',
                'permission' => 'setup.view',
            ],
            [
                'label' => 'Sections',
                'route' => 'app.setup.sections.index',
                'permission' => 'setup.view',
            ],
            [
                'label' => 'Lines',
                'route' => 'app.setup.lines.index',
                'permission' => 'setup.view',
            ],
            [
                'label' => 'Machine Categories',
                'route' => 'app.setup.machine-categories.index',
                'permission' => 'setup.view',
            ],
        ],
        'masters' => [
            [
                'label' => 'Users',
                'route' => 'app.masters.users.index',
                'permission' => 'users.view',
            ],
            [
                'label' => 'Vendors',
                'route' => 'app.masters.vendors.index',
                'permission' => 'vendors.view',
            ],
            [
                'label' => 'Agreements',
                'route' => 'app.masters.agreements.index',
                'permission' => 'agreements.view',
            ],
            [
                'label' => 'Machines',
                'route' => 'app.masters.machines.index',
                'permission' => 'machine-master.view',
            ],
            [
                'label' => 'Rent Machine Details',
                'route' => 'app.masters.rent-machine-details.index',
                'permission' => 'rent-machines.view',
            ],
            [
                'label' => 'Machine Allocations',
                'route' => 'app.masters.machine-allocations.index',
                'permission' => 'allocation.view',
            ],
        ],
    ],
    'module_links' => [
        'setup' => [
            'app.setup.departments.index',
            'app.setup.shifts.index',
            'app.setup.factory-units.index',
            'app.setup.floors.index',
            'app.setup.sections.index',
            'app.setup.lines.index',
            'app.setup.machine-categories.index',
        ],
        'users-access' => [
            'app.masters.users.index',
        ],
        'vendors' => [
            'app.masters.vendors.index',
        ],
        'agreements' => [
            'app.masters.agreements.index',
        ],
        'machine-master' => [
            'app.masters.machines.index',
        ],
        'rent-machines' => [
            'app.masters.rent-machine-details.index',
        ],
        'allocation' => [
            'app.masters.machine-allocations.index',
        ],
    ],
];
