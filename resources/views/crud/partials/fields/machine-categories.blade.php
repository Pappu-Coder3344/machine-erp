@php
    $isActive = (int) old('is_active', $record->is_active ?? 1);
    $selectedFrequency = (string) old('default_pm_frequency', $record->default_pm_frequency);
@endphp

<div class="col-md-3">
    <label for="code" class="form-label">Category Code</label>
    <input type="text" id="code" name="code" class="form-control" value="{{ old('code', $record->code) }}" required>
</div>

<div class="col-md-5">
    <label for="name" class="form-label">Category Name</label>
    <input type="text" id="name" name="name" class="form-control" value="{{ old('name', $record->name) }}" required>
</div>

<div class="col-md-2">
    <label for="default_pm_frequency" class="form-label">Default PM</label>
    <select id="default_pm_frequency" name="default_pm_frequency" class="form-select">
        <option value="">Not set</option>
        @foreach ($formData['pmFrequencies'] as $frequency)
            <option value="{{ $frequency }}" {{ $selectedFrequency === $frequency ? 'selected' : '' }}>{{ $frequency }}</option>
        @endforeach
    </select>
</div>

<div class="col-md-2">
    <label for="is_active" class="form-label">Status</label>
    <select id="is_active" name="is_active" class="form-select" required>
        <option value="1" {{ $isActive === 1 ? 'selected' : '' }}>Active</option>
        <option value="0" {{ $isActive === 0 ? 'selected' : '' }}>Inactive</option>
    </select>
</div>

<div class="col-12">
    <label for="description" class="form-label">Description</label>
    <textarea id="description" name="description" class="form-control" rows="3" placeholder="Common machine family, PM expectation, or support note">{{ old('description', $record->description) }}</textarea>
</div>
