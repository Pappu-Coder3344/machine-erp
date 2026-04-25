@extends('layouts.app')

@section('content')
    <div class="content-section">
        @include('crud.partials.alerts')

        <div class="erp-card filter-panel">
            <div class="section-header">
                <div>
                    <h2 class="section-title">{{ $resourcePluralLabel }}</h2>
                    <p class="section-text">Manage backend records for {{ strtolower($resourcePluralLabel) }} without changing the existing frontend prototype files.</p>
                </div>
                <div class="section-tools">
                    @if ($canCreate)
                        <a href="{{ route($routeNamePrefix.'.create') }}" class="btn btn-primary">Add {{ $resourceLabel }}</a>
                    @endif
                    <a href="{{ route('app.modules.show', ['module' => $currentModuleKey]) }}" class="btn btn-outline-secondary">Back to Module</a>
                </div>
            </div>

            <form method="GET" class="row g-3 align-items-end">
                <div class="col-md-5">
                    <label for="q" class="form-label">Search</label>
                    <input type="text" id="q" name="q" class="form-control" value="{{ $searchTerm }}" placeholder="Search by code, name, or key fields">
                </div>
                <div class="col-md-3 d-grid">
                    <button type="submit" class="btn btn-outline-primary">Apply Search</button>
                </div>
                <div class="col-md-3 d-grid">
                    <a href="{{ route($routeNamePrefix.'.index') }}" class="btn btn-outline-secondary">Reset</a>
                </div>
            </form>
        </div>
    </div>

    <div class="content-section">
        <div class="erp-card">
            <div class="table-responsive">
                <table class="table erp-table mobile-card-table">
                    <thead>
                        <tr>
                            @foreach ($columns as $column)
                                <th>{{ $column['label'] }}</th>
                            @endforeach
                            @if ($canEdit || $canDelete)
                                <th class="text-end">Actions</th>
                            @endif
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($records as $record)
                            <tr>
                                @foreach ($columns as $column)
                                    @php
                                        $value = data_get($record, $column['key']);
                                        if ($value instanceof \BackedEnum) {
                                            $value = $value->value;
                                        }
                                    @endphp
                                    <td data-label="{{ $column['label'] }}">
                                        @switch($column['format'] ?? 'text')
                                            @case('boolean')
                                                <span class="badge text-bg-{{ $value ? 'success' : 'secondary' }}">{{ $value ? 'Active' : 'Inactive' }}</span>
                                                @break
                                            @case('date')
                                                {{ $value ? \Illuminate\Support\Carbon::parse($value)->format('d M Y') : '-' }}
                                                @break
                                            @case('datetime')
                                                {{ $value ? \Illuminate\Support\Carbon::parse($value)->format('d M Y h:i A') : '-' }}
                                                @break
                                            @case('currency')
                                                {{ $value !== null && $value !== '' ? 'BDT '.number_format((float) $value, 2) : '-' }}
                                                @break
                                            @case('badge')
                                                <span class="badge text-bg-{{ $column['badge_map'][$value] ?? 'secondary' }}">{{ $value ?: '-' }}</span>
                                                @break
                                            @default
                                                {{ $value !== null && $value !== '' ? $value : '-' }}
                                        @endswitch
                                    </td>
                                @endforeach

                                @if ($canEdit || $canDelete)
                                    <td class="text-end" data-label="Actions">
                                        <div class="table-actions">
                                            @if ($canEdit)
                                                <a href="{{ route($routeNamePrefix.'.edit', $record) }}" class="btn btn-outline-primary btn-sm">Edit</a>
                                            @endif
                                            @if ($canDelete)
                                                <form method="POST" action="{{ route($routeNamePrefix.'.destroy', $record) }}" onsubmit="return confirm('Delete this {{ strtolower($resourceLabel) }} record?');">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="btn btn-outline-danger btn-sm">Delete</button>
                                                </form>
                                            @endif
                                        </div>
                                    </td>
                                @endif
                            </tr>
                        @empty
                            <tr>
                                <td colspan="{{ count($columns) + (($canEdit || $canDelete) ? 1 : 0) }}" class="text-center text-muted py-4">
                                    No {{ strtolower($resourcePluralLabel) }} records found.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            @if ($records->hasPages())
                <div class="responsive-pagination mt-3">
                    {{ $records->links() }}
                </div>
            @endif
        </div>
    </div>
@endsection
