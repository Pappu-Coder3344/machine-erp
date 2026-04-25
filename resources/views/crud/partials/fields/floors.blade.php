@php
    $selectedFactoryUnit = (string) old('factory_unit_id', $record->factory_unit_id);
    $selectedShift = (string) old('shift_id', $record->shift_id);
    $selectedStatus = (string) old('status', $record->status ?: 'Active');
@endphp

<div class="col-md-4">
    <label for="factory_unit_id" class="form-label">Factory Unit</label>
    <select id="factory_unit_id" name="factory_unit_id" class="form-select" required>
        <option value="">Select factory unit</option>
        @foreach ($formData['factoryUnits'] as $factoryUnit)
            <option value="{{ $factoryUnit->id }}" {{ $selectedFactoryUnit === (string) $factoryUnit->id ? 'selected' : '' }}>
                {{ $factoryUnit->name }} ({{ $factoryUnit->code }})
            </option>
        @endforeach
    </select>
</div>

<div class="col-md-4">
    <label for="shift_id" class="form-label">Shift</label>
    <select id="shift_id" name="shift_id" class="form-select">
        <option value="">No linked shift</option>
        @foreach ($formData['shifts'] as $shift)
            <option value="{{ $shift->id }}" {{ $selectedShift === (string) $shift->id ? 'selected' : '' }}>
                {{ $shift->name }}
            </option>
        @endforeach
    </select>
</div>

<div class="col-md-4">
    <label for="status" class="form-label">Status</label>
    <select id="status" name="status" class="form-select" required>
        <option value="Active" {{ $selectedStatus === 'Active' ? 'selected' : '' }}>Active</option>
        <option value="Inactive" {{ $selectedStatus === 'Inactive' ? 'selected' : '' }}>Inactive</option>
    </select>
</div>

<div class="col-md-3">
    <label for="code" class="form-label">Floor Code</label>
    <input type="text" id="code" name="code" class="form-control" value="{{ old('code', $record->code) }}" required>
</div>

<div class="col-md-5">
    <label for="name" class="form-label">Floor Name</label>
    <input type="text" id="name" name="name" class="form-control" value="{{ old('name', $record->name) }}" required>
</div>

<div class="col-md-2">
    <label for="area_type" class="form-label">Area Type</label>
    <input type="text" id="area_type" name="area_type" class="form-control" value="{{ old('area_type', $record->area_type) }}" placeholder="Sewing">
</div>

<div class="col-md-2">
    <label for="sort_order" class="form-label">Sort Order</label>
    <input type="number" id="sort_order" name="sort_order" class="form-control" min="0" value="{{ old('sort_order', $record->sort_order ?? 0) }}">
</div>

<div class="col-md-4">
    <label for="machine_capacity" class="form-label">Machine Capacity</label>
    <input type="number" id="machine_capacity" name="machine_capacity" class="form-control" min="0" value="{{ old('machine_capacity', $record->machine_capacity) }}">
</div>

<div class="col-md-8">
    <label for="supervisor_name" class="form-label">Supervisor Name</label>
    <input type="text" id="supervisor_name" name="supervisor_name" class="form-control" value="{{ old('supervisor_name', $record->supervisor_name) }}">
</div>
