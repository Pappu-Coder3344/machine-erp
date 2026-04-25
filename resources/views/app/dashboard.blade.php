@extends('layouts.app')

@section('content')
    <div class="content-section">
        <div class="row g-3">
            <div class="col-lg-4">
                <div class="summary-card h-100">
                    <span class="summary-label">Signed-In User</span>
                    <h2 class="summary-value fs-3 mb-2">{{ $user->name }}</h2>
                    <p class="summary-note mb-1">Employee Code: {{ $user->employee_code ?? 'N/A' }}</p>
                    <p class="summary-note mb-1">Username: {{ $user->username }}</p>
                    <p class="summary-note mb-0">Status: {{ $user->status->value }}</p>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="summary-card h-100">
                    <span class="summary-label">Role Summary</span>
                    <h2 class="summary-value fs-3 mb-2">{{ implode(', ', $user->roleNames()) }}</h2>
                    <p class="summary-note mb-1">Department: {{ $user->department?->name ?? 'Not Assigned' }}</p>
                    <p class="summary-note mb-1">Shift: {{ $user->shift?->name ?? 'Not Assigned' }}</p>
                    <p class="summary-note mb-0">Factory Unit: {{ $user->factoryUnit?->name ?? 'Not Assigned' }}</p>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="summary-card h-100">
                    <span class="summary-label">Access Snapshot</span>
                    <h2 class="summary-value fs-3 mb-2">{{ $accessibleModules->count() }}</h2>
                    <p class="summary-note mb-1">Accessible modules are enforced by runtime permission middleware.</p>
                    <p class="summary-note mb-0">CRUD and business workflow APIs remain intentionally deferred to later phases.</p>
                </div>
            </div>
        </div>
    </div>

    <div class="content-section">
        <div class="erp-card">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Module Access Foundation</h2>
                    <p class="section-text">Each module below is now mapped to a backend permission slug and can be protected before CRUD/API phases begin.</p>
                </div>
            </div>

            <div class="row g-3">
                @foreach ($modules as $module)
                    <div class="col-md-6 col-xl-4">
                        <div class="erp-card h-100">
                            <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
                                <div>
                                    <h3 class="section-title fs-6 mb-1">{{ $module['label'] }}</h3>
                                    <p class="section-text mb-0">{{ $module['description'] }}</p>
                                </div>
                                <span class="badge text-bg-{{ $module['granted'] ? 'success' : 'secondary' }}">
                                    {{ $module['granted'] ? 'Allowed' : 'Blocked' }}
                                </span>
                            </div>

                            <div class="compact-note mb-3">
                                Required permission: <code>{{ $module['permission'] }}</code>
                            </div>

                            @if ($module['granted'])
                                <a href="{{ $module['url'] }}" class="btn btn-primary btn-sm">Open Access Preview</a>
                            @else
                                <button type="button" class="btn btn-outline-secondary btn-sm" disabled>Access Restricted</button>
                            @endif
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>

    <div class="content-section">
        <div class="erp-card">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Granted Permission Slugs</h2>
                    <p class="section-text">This is the runtime permission set available to the signed-in user through the existing roles, role_permissions, and user_roles tables.</p>
                </div>
            </div>

            <div class="page-outline-links">
                @foreach ($user->permissionSlugs() as $permissionSlug)
                    <span class="page-outline-link">{{ $permissionSlug }}</span>
                @endforeach
            </div>
        </div>
    </div>
@endsection
