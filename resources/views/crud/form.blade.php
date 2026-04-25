@extends('layouts.app')

@section('content')
    <div class="content-section">
        @include('crud.partials.alerts')

        <div class="erp-card page-breadcrumb-card">
            <div class="page-breadcrumb">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="{{ route($routeNamePrefix.'.index') }}">{{ $resourcePluralLabel }}</a></li>
                            <li class="breadcrumb-item active" aria-current="page">{{ $pageTitle }}</li>
                        </ol>
                    </nav>
                </div>
                <div class="page-breadcrumb-meta">
                    <span class="page-context-chip">Phase 3 CRUD</span>
                    <span class="page-role-chip">{{ implode(', ', $user->roleNames()) }}</span>
                </div>
            </div>
        </div>
    </div>

    <div class="content-section">
        <form method="POST" action="{{ $formAction }}" class="erp-card">
            @csrf
            @if ($formMethod !== 'POST')
                @method($formMethod)
            @endif

            <div class="section-header">
                <div>
                    <h2 class="section-title">{{ $pageTitle }}</h2>
                    <p class="section-text">{{ $pageSubtitle }}</p>
                </div>
                <div class="section-tools">
                    <a href="{{ route($routeNamePrefix.'.index') }}" class="btn btn-outline-secondary">Back to List</a>
                </div>
            </div>

            <div class="row g-3">
                @include($formPartial, ['record' => $record, 'formData' => $formData])
            </div>

            <div class="d-flex flex-column flex-sm-row gap-2 mt-4">
                <button type="submit" class="btn btn-primary">{{ $submitLabel }}</button>
                <a href="{{ route($routeNamePrefix.'.index') }}" class="btn btn-outline-secondary">Cancel</a>
            </div>
        </form>
    </div>
@endsection
