<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $pageTitle ?? 'App' }} | LML Machine Management</title>
    <link rel="icon" type="image/jpeg" href="{{ url('/prototype-assets/img/logo.jpg') }}?v=20260424">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ url('/prototype-assets/css/style.css') }}?v=20260424">
    <link rel="stylesheet" href="{{ url('/prototype-assets/css/pages.css') }}?v=20260424">
</head>
<body>
    @php
        $modules = $modules ?? collect(config('access.modules', []))
            ->map(function (array $module, string $key) use ($user) {
                return [
                    'key' => $key,
                    'label' => $module['label'],
                    'description' => $module['description'],
                    'permission' => $module['permission'],
                    'granted' => $user->canAccessModule($key),
                    'url' => route('app.modules.show', ['module' => $key]),
                ];
            })
            ->values();

        $crudNavigation = collect(config('crud.navigation', []))
            ->map(fn (array $items, string $group) => [
                'group' => $group,
                'items' => collect($items)
                    ->filter(fn (array $item) => $user->hasPermission($item['permission']))
                    ->values(),
            ])
            ->filter(fn (array $group) => $group['items']->isNotEmpty())
            ->values();
    @endphp

    <div class="app-layout">
        <aside class="sidebar">
            <div class="sidebar-brand">
                <div class="brand-logo-wrap">
                    <img src="{{ url('/prototype-assets/img/logo.jpg') }}?v=20260424" alt="Louietex logo" class="brand-logo">
                </div>
                <div>
                    <h1 class="brand-title">LML Machine Management</h1>
                    <p class="brand-subtitle">Laravel auth, roles, and permission foundation</p>
                </div>
            </div>

            <nav class="sidebar-nav">
                <div class="sidebar-nav-group">
                    <span class="sidebar-nav-heading">Main</span>
                    <a href="{{ route('app.dashboard') }}" class="nav-link-item {{ ($currentModuleKey ?? 'dashboard') === 'dashboard' ? 'active' : '' }}">
                        Dashboard
                    </a>
                </div>

                <div class="sidebar-nav-group">
                    <span class="sidebar-nav-heading">Accessible Modules</span>
                    @foreach ($modules->where('granted', true) as $navModule)
                        @continue($navModule['key'] === 'dashboard')

                        <a href="{{ $navModule['url'] }}" class="nav-link-item {{ ($currentModuleKey ?? null) === $navModule['key'] ? 'active' : '' }}">
                            {{ $navModule['label'] }}
                        </a>
                    @endforeach
                </div>

                @foreach ($crudNavigation as $navGroup)
                    <div class="sidebar-nav-group">
                        <span class="sidebar-nav-heading">{{ ucfirst($navGroup['group']) }} CRUD</span>
                        @foreach ($navGroup['items'] as $navItem)
                            <a href="{{ route($navItem['route']) }}" class="nav-link-item {{ request()->routeIs($navItem['route']) ? 'active' : '' }}">
                                {{ $navItem['label'] }}
                            </a>
                        @endforeach
                    </div>
                @endforeach
            </nav>

            <div class="sidebar-footer">
                <div class="factory-info">
                    <span class="info-label">Signed in as</span>
                    <strong>{{ $user->name }}</strong>
                    <div class="text-light-emphasis small mt-1">{{ $user->primaryRole()?->name ?? 'No Role' }}</div>
                </div>
                <div class="factory-info">
                    <span class="info-label">Factory Unit</span>
                    <strong>{{ $user->factoryUnit?->name ?? 'Not Assigned' }}</strong>
                </div>
            </div>
        </aside>

        <div class="content-wrapper">
            <header class="top-header">
                <div class="header-start">
                    <div>
                        <div class="page-title">{{ $pageTitle ?? 'LML App' }}</div>
                        <p class="page-subtitle mb-0">{{ $pageSubtitle ?? 'Role-aware backend access preview' }}</p>
                    </div>
                </div>

                <div class="header-actions">
                    <div class="app-user-menu">
                        <button type="button" class="user-menu-trigger btn">
                            <span class="user-avatar">{{ strtoupper(substr($user->name, 0, 1)) }}</span>
                            <span class="user-meta">
                                <strong>{{ $user->name }}</strong>
                                <span>{{ implode(', ', $user->roleNames()) }}</span>
                            </span>
                        </button>
                    </div>

                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="btn btn-outline-secondary">Logout</button>
                    </form>
                </div>
            </header>

            <main class="main-content">
                @yield('content')
            </main>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
