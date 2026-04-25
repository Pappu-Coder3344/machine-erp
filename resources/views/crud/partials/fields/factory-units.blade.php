@php
    $isActive = (int) old('is_active', $record->is_active ?? 1);
@endphp

<div class="col-md-3">
    <label for="code" class="form-label">Factory Unit Code</label>
    <input type="text" id="code" name="code" class="form-control" value="{{ old('code', $record->code) }}" required>
</div>

<div class="col-md-5">
    <label for="name" class="form-label">Factory Unit Name</label>
    <input type="text" id="name" name="name" class="form-control" value="{{ old('name', $record->name) }}" required>
</div>

<div class="col-md-2">
    <label for="area_type" class="form-label">Area Type</label>
    <input type="text" id="area_type" name="area_type" class="form-control" value="{{ old('area_type', $record->area_type) }}" placeholder="Production">
</div>

<div class="col-md-2">
    <label for="is_active" class="form-label">Status</label>
    <select id="is_active" name="is_active" class="form-select" required>
        <option value="1" {{ $isActive === 1 ? 'selected' : '' }}>Active</option>
        <option value="0" {{ $isActive === 0 ? 'selected' : '' }}>Inactive</option>
    </select>
</div>

<div class="col-md-12">
    <label for="address" class="form-label">Address</label>
    <input type="text" id="address" name="address" class="form-control" value="{{ old('address', $record->address) }}" placeholder="Factory location or block details">
</div>

<div class="col-12">
    <label for="description" class="form-label">Description</label>
    <textarea id="description" name="description" class="form-control" rows="3" placeholder="Operational notes for this factory unit">{{ old('description', $record->description) }}</textarea>
</div>
