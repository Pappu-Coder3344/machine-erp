@extends('layouts.app')

@section('content')
    <div class="content-section">
        <div class="erp-card page-breadcrumb-card">
            <div class="page-breadcrumb">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="{{ route('app.dashboard') }}">Access Dashboard</a></li>
                            <li class="breadcrumb-item active" aria-current="page">{{ $module['label'] }}</li>
                        </ol>
                    </nav>
                </div>
                <div class="page-breadcrumb-meta">
                    <span class="page-context-chip">Preview Only</span>
                    <span class="page-role-chip">{{ implode(', ', $user->roleNames()) }}</span>
                </div>
            </div>
        </div>
    </div>

    <div class="content-section">
        <div class="row g-3">
            <div class="col-lg-8">
                <div class="erp-card h-100">
                    <div class="section-header">
                        <div>
                            <h2 class="section-title">{{ $module['label'] }}</h2>
                            <p class="section-text">{{ $module['description'] }}</p>
                        </div>
                    </div>

                    <div class="audit-meta-grid">
                        <div class="audit-meta-item">
                            <strong>Route Key</strong>
                            <span>{{ $module['key'] }}</span>
                        </div>
                        <div class="audit-meta-item">
                            <strong>Permission</strong>
                            <span>{{ $module['permission'] }}</span>
                        </div>
                        <div class="audit-meta-item">
                            <strong>Gate</strong>
                            <span>{{ $module['gate'] }}</span>
                        </div>
                        <div class="audit-meta-item">
                            <strong>Current Access</strong>
                            <span>{{ $module['granted'] ? 'Allowed' : 'Blocked' }}</span>
                        </div>
                    </div>

                    <div class="compact-note mt-3">
                        This page confirms that backend route protection is active for the <strong>{{ $module['label'] }}</strong> module. Business CRUD, workflow APIs, and report queries are intentionally not implemented in Phase 2.
                    </div>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="erp-card h-100">
                    <div class="section-header">
                        <div>
                            <h2 class="section-title">User Context</h2>
                            <p class="section-text">Current access is derived from the signed-in user's seeded role and permission mapping.</p>
                        </div>
                    </div>

                    <div class="mini-stat-list">
                        <div class="mini-stat-item">
                            <span>Name</span>
                            <strong>{{ $user->name }}</strong>
                        </div>
                        <div class="mini-stat-item">
                            <span>Username</span>
                            <strong>{{ $user->username }}</strong>
                        </div>
                        <div class="mini-stat-item">
                            <span>Primary Role</span>
                            <strong>{{ $user->primaryRole()?->name ?? 'No Role' }}</strong>
                        </div>
                        <div class="mini-stat-item">
                            <span>Status</span>
                            <strong>{{ $user->status->value }}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="content-section">
        <div class="erp-card">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Other Accessible Modules</h2>
                    <p class="section-text">Only modules allowed by the current role-permission mapping are shown here.</p>
                </div>
            </div>

            <div class="page-outline-links">
                @foreach ($modules->where('granted', true) as $navModule)
                    <a href="{{ $navModule['url'] }}" class="page-outline-link">{{ $navModule['label'] }}</a>
                @endforeach
            </div>
        </div>
    </div>

    @php
        $moduleCrudLinks = collect(config('crud.module_links.'.$module['key'], []))
            ->filter(fn (string $routeName) => \Illuminate\Support\Facades\Route::has($routeName))
            ->map(fn (string $routeName) => [
                'route' => $routeName,
                'label' => str($routeName)->afterLast('.')->replace('-', ' ')->title()->value(),
            ])
            ->values();
    @endphp

    @if ($moduleCrudLinks->isNotEmpty())
        <div class="content-section">
            <div class="erp-card">
                <div class="section-header">
                    <div>
                        <h2 class="section-title">Phase 3 CRUD Links</h2>
                        <p class="section-text">These runtime-managed screens now use database records instead of frontend-only mock assumptions.</p>
                    </div>
                </div>

                <div class="page-outline-links">
                    @foreach ($moduleCrudLinks as $crudLink)
                        <a href="{{ route($crudLink['route']) }}" class="page-outline-link">{{ $crudLink['label'] }}</a>
                    @endforeach
                </div>
            </div>
        </div>
    @endif
@endsection
