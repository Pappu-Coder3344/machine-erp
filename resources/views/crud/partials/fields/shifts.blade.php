@php
    $isActive = (int) old('is_active', $record->is_active ?? 1);
    $startTime = old('start_time', $record->start_time?->format('H:i'));
    $endTime = old('end_time', $record->end_time?->format('H:i'));
@endphp

<div class="col-md-4">
    <label for="code" class="form-label">Shift Code</label>
    <input type="text" id="code" name="code" class="form-control" value="{{ old('code', $record->code) }}" required>
</div>

<div class="col-md-4">
    <label for="name" class="form-label">Shift Name</label>
    <input type="text" id="name" name="name" class="form-control" value="{{ old('name', $record->name) }}" required>
</div>

<div class="col-md-4">
    <label for="is_active" class="form-label">Status</label>
    <select id="is_active" name="is_active" class="form-select" required>
        <option value="1" {{ $isActive === 1 ? 'selected' : '' }}>Active</option>
        <option value="0" {{ $isActive === 0 ? 'selected' : '' }}>Inactive</option>
    </select>
</div>

<div class="col-md-3">
    <label for="start_time" class="form-label">Start Time</label>
    <input type="time" id="start_time" name="start_time" class="form-control" value="{{ $startTime }}">
</div>

<div class="col-md-3">
    <label for="end_time" class="form-label">End Time</label>
    <input type="time" id="end_time" name="end_time" class="form-control" value="{{ $endTime }}">
</div>

<div class="col-md-6">
    <label for="description" class="form-label">Description</label>
    <input type="text" id="description" name="description" class="form-control" value="{{ old('description', $record->description) }}" placeholder="Example: General day shift for production support">
</div>
