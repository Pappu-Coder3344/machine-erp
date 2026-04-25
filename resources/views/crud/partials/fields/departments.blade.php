@php
    $isActive = (int) old('is_active', $record->is_active ?? 1);
@endphp

<div class="col-md-4">
    <label for="code" class="form-label">Department Code</label>
    <input type="text" id="code" name="code" class="form-control" value="{{ old('code', $record->code) }}" required>
</div>

<div class="col-md-8">
    <label for="name" class="form-label">Department Name</label>
    <input type="text" id="name" name="name" class="form-control" value="{{ old('name', $record->name) }}" required>
</div>

<div class="col-md-8">
    <label for="description" class="form-label">Description</label>
    <input type="text" id="description" name="description" class="form-control" value="{{ old('description', $record->description) }}" placeholder="Example: Maintenance operations and planning">
</div>

<div class="col-md-4">
    <label for="is_active" class="form-label">Status</label>
    <select id="is_active" name="is_active" class="form-select" required>
        <option value="1" {{ $isActive === 1 ? 'selected' : '' }}>Active</option>
        <option value="0" {{ $isActive === 0 ? 'selected' : '' }}>Inactive</option>
    </select>
</div>
