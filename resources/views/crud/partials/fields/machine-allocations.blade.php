@php
    $selectedMachine = (string) old('machine_id', $record->machine_id);
    $selectedFromFloor = (string) old('from_floor_id', $record->from_floor_id);
    $selectedFromLine = (string) old('from_line_id', $record->from_line_id);
    $selectedToFloor = (string) old('to_floor_id', $record->to_floor_id);
    $selectedToLine = (string) old('to_line_id', $record->to_line_id);
    $selectedUser = (string) old('allocated_by_user_id', $record->allocated_by_user_id);
    $selectedType = (string) old('allocation_type', $record->allocation_type ?: 'Allocation');
    $selectedStatus = (string) old('status', $record->status ?: 'Active');
    $allocatedAt = old('allocated_at', $record->allocated_at?->format('Y-m-d\\TH:i'));
@endphp

<div class="col-md-4">
    <label for="machine_id" class="form-label">Machine</label>
    <select id="machine_id" name="machine_id" class="form-select" required>
        <option value="">Select machine</option>
        @foreach ($formData['machines'] as $machine)
            <option value="{{ $machine->id }}" {{ $selectedMachine === (string) $machine->id ? 'selected' : '' }}>
                {{ $machine->code }} - {{ $machine->name }}
            </option>
        @endforeach
    </select>
</div>

<div class="col-md-4">
    <label for="allocation_type" class="form-label">Allocation Type</label>
    <select id="allocation_type" name="allocation_type" class="form-select" required>
        @foreach ($formData['allocationTypes'] as $allocationType)
            <option value="{{ $allocationType }}" {{ $selectedType === $allocationType ? 'selected' : '' }}>{{ $allocationType }}</option>
        @endforeach
    </select>
</div>

<div class="col-md-4">
    <label for="allocated_at" class="form-label">Allocated At</label>
    <input type="datetime-local" id="allocated_at" name="allocated_at" class="form-control" value="{{ $allocatedAt }}" required>
</div>

<div class="col-md-3">
    <label for="from_floor_id" class="form-label">From Floor</label>
    <select id="from_floor_id" name="from_floor_id" class="form-select">
        <option value="">No source floor</option>
        @foreach ($formData['floors'] as $floor)
            <option value="{{ $floor->id }}" {{ $selectedFromFloor === (string) $floor->id ? 'selected' : '' }}>
                {{ $floor->name }} - {{ $floor->factoryUnit?->name }}
            </option>
        @endforeach
    </select>
</div>

<div class="col-md-3">
    <label for="from_line_id" class="form-label">From Line</label>
    <select id="from_line_id" name="from_line_id" class="form-select">
        <option value="">No source line</option>
        @foreach ($formData['lines'] as $line)
            <option value="{{ $line->id }}" {{ $selectedFromLine === (string) $line->id ? 'selected' : '' }}>
                {{ $line->name }} - {{ $line->floor?->name }}
            </option>
        @endforeach
    </select>
</div>

<div class="col-md-3">
    <label for="to_floor_id" class="form-label">To Floor</label>
    <select id="to_floor_id" name="to_floor_id" class="form-select">
        <option value="">No target floor</option>
        @foreach ($formData['floors'] as $floor)
            <option value="{{ $floor->id }}" {{ $selectedToFloor === (string) $floor->id ? 'selected' : '' }}>
                {{ $floor->name }} - {{ $floor->factoryUnit?->name }}
            </option>
        @endforeach
    </select>
</div>

<div class="col-md-3">
    <label for="to_line_id" class="form-label">To Line</label>
    <select id="to_line_id" name="to_line_id" class="form-select">
        <option value="">No target line</option>
        @foreach ($formData['lines'] as $line)
            <option value="{{ $line->id }}" {{ $selectedToLine === (string) $line->id ? 'selected' : '' }}>
                {{ $line->name }} - {{ $line->floor?->name }}
            </option>
        @endforeach
    </select>
</div>

<div class="col-md-4">
    <label for="allocated_by_user_id" class="form-label">Allocated By</label>
    <select id="allocated_by_user_id" name="allocated_by_user_id" class="form-select">
        <option value="">Use current signed-in user</option>
        @foreach ($formData['users'] as $allocationUser)
            <option value="{{ $allocationUser->id }}" {{ $selectedUser === (string) $allocationUser->id ? 'selected' : '' }}>
                {{ $allocationUser->name }} ({{ $allocationUser->username }})
            </option>
        @endforeach
    </select>
</div>

<div class="col-md-4">
    <label for="reason" class="form-label">Reason</label>
    <input type="text" id="reason" name="reason" class="form-control" value="{{ old('reason', $record->reason) }}" placeholder="Example: Line balancing or urgent replacement">
</div>

<div class="col-md-4">
    <label for="status" class="form-label">Status</label>
    <select id="status" name="status" class="form-select" required>
        @foreach ($formData['statuses'] as $status)
            <option value="{{ $status }}" {{ $selectedStatus === $status ? 'selected' : '' }}>{{ $status }}</option>
        @endforeach
    </select>
</div>

<div class="col-12">
    <label for="remarks" class="form-label">Remarks</label>
    <textarea id="remarks" name="remarks" class="form-control" rows="3" placeholder="Shift note, transfer detail, or receiving note">{{ old('remarks', $record->remarks) }}</textarea>
</div>
