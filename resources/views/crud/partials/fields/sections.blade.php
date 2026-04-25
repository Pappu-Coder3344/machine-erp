@php
    $selectedFloor = (string) old('floor_id', $record->floor_id);
    $selectedShift = (string) old('shift_id', $record->shift_id);
    $selectedStatus = (string) old('status', $record->status ?: 'Active');
@endphp

<div class="col-md-4">
    <label for="floor_id" class="form-label">Floor</label>
    <select id="floor_id" name="floor_id" class="form-select" required>
        <option value="">Select floor</option>
        @foreach ($formData['floors'] as $floor)
            <option value="{{ $floor->id }}" {{ $selectedFloor === (string) $floor->id ? 'selected' : '' }}>
                {{ $floor->name }} - {{ $floor->factoryUnit?->name }}
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
    <label for="code" class="form-label">Section Code</label>
    <input type="text" id="code" name="code" class="form-control" value="{{ old('code', $record->code) }}" required>
</div>

<div class="col-md-5">
    <label for="name" class="form-label">Section Name</label>
    <input type="text" id="name" name="name" class="form-control" value="{{ old('name', $record->name) }}" required>
</div>

<div class="col-md-2">
    <label for="sort_order" class="form-label">Sort Order</label>
    <input type="number" id="sort_order" name="sort_order" class="form-control" min="0" value="{{ old('sort_order', $record->sort_order ?? 0) }}">
</div>

<div class="col-md-2">
    <label for="line_group_name" class="form-label">Line Group</label>
    <input type="text" id="line_group_name" name="line_group_name" class="form-control" value="{{ old('line_group_name', $record->line_group_name) }}">
</div>

<div class="col-md-4">
    <label for="machine_focus" class="form-label">Machine Focus</label>
    <input type="text" id="machine_focus" name="machine_focus" class="form-control" value="{{ old('machine_focus', $record->machine_focus) }}" placeholder="Example: Sewing / Finishing">
</div>

<div class="col-md-8">
    <label for="in_charge_name" class="form-label">In-Charge Name</label>
    <input type="text" id="in_charge_name" name="in_charge_name" class="form-control" value="{{ old('in_charge_name', $record->in_charge_name) }}">
</div>
