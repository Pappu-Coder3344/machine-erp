@php
    $selectedCategory = (string) old('machine_category_id', $record->machine_category_id);
    $selectedFloor = (string) old('floor_id', $record->floor_id);
    $selectedLine = (string) old('line_id', $record->line_id);
    $selectedOwnership = (string) old('ownership_type', $record->ownership_type?->value ?? $record->ownership_type ?? 'Own');
    $selectedStatus = (string) old('current_status', $record->current_status?->value ?? $record->current_status ?? 'Active');
    $selectedCriticality = (string) old('criticality', $record->criticality);
    $repeatWatch = (int) old('repeat_watch', $record->repeat_watch ?? 0);
@endphp

<div class="col-md-4">
    <label for="machine_category_id" class="form-label">Machine Category</label>
    <select id="machine_category_id" name="machine_category_id" class="form-select">
        <option value="">No category</option>
        @foreach ($formData['machineCategories'] as $category)
            <option value="{{ $category->id }}" {{ $selectedCategory === (string) $category->id ? 'selected' : '' }}>
                {{ $category->name }}
            </option>
        @endforeach
    </select>
</div>

<div class="col-md-4">
    <label for="floor_id" class="form-label">Floor</label>
    <select id="floor_id" name="floor_id" class="form-select">
        <option value="">No floor assigned</option>
        @foreach ($formData['floors'] as $floor)
            <option value="{{ $floor->id }}" {{ $selectedFloor === (string) $floor->id ? 'selected' : '' }}>
                {{ $floor->name }} - {{ $floor->factoryUnit?->name }}
            </option>
        @endforeach
    </select>
</div>

<div class="col-md-4">
    <label for="line_id" class="form-label">Line</label>
    <select id="line_id" name="line_id" class="form-select">
        <option value="">No line assigned</option>
        @foreach ($formData['lines'] as $line)
            <option value="{{ $line->id }}" {{ $selectedLine === (string) $line->id ? 'selected' : '' }}>
                {{ $line->name }} - {{ $line->floor?->name }}
            </option>
        @endforeach
    </select>
</div>

<div class="col-md-3">
    <label for="code" class="form-label">Machine Code</label>
    <input type="text" id="code" name="code" class="form-control" value="{{ old('code', $record->code) }}" required>
</div>

<div class="col-md-5">
    <label for="name" class="form-label">Machine Name</label>
    <input type="text" id="name" name="name" class="form-control" value="{{ old('name', $record->name) }}" required>
</div>

<div class="col-md-2">
    <label for="ownership_type" class="form-label">Ownership</label>
    <select id="ownership_type" name="ownership_type" class="form-select" required>
        @foreach ($formData['ownershipTypes'] as $ownershipType)
            <option value="{{ $ownershipType }}" {{ $selectedOwnership === $ownershipType ? 'selected' : '' }}>{{ $ownershipType }}</option>
        @endforeach
    </select>
</div>

<div class="col-md-2">
    <label for="current_status" class="form-label">Status</label>
    <select id="current_status" name="current_status" class="form-select" required>
        @foreach ($formData['statuses'] as $status)
            <option value="{{ $status }}" {{ $selectedStatus === $status ? 'selected' : '' }}>{{ $status }}</option>
        @endforeach
    </select>
</div>

<div class="col-md-3">
    <label for="brand" class="form-label">Brand</label>
    <input type="text" id="brand" name="brand" class="form-control" value="{{ old('brand', $record->brand) }}">
</div>

<div class="col-md-3">
    <label for="model" class="form-label">Model</label>
    <input type="text" id="model" name="model" class="form-control" value="{{ old('model', $record->model) }}">
</div>

<div class="col-md-3">
    <label for="serial_no" class="form-label">Serial No</label>
    <input type="text" id="serial_no" name="serial_no" class="form-control" value="{{ old('serial_no', $record->serial_no) }}">
</div>

<div class="col-md-3">
    <label for="installed_at" class="form-label">Installed Date</label>
    <input type="date" id="installed_at" name="installed_at" class="form-control" value="{{ old('installed_at', $record->installed_at?->format('Y-m-d')) }}">
</div>

<div class="col-md-3">
    <label for="criticality" class="form-label">Criticality</label>
    <select id="criticality" name="criticality" class="form-select">
        <option value="">Not set</option>
        @foreach ($formData['criticalities'] as $criticality)
            <option value="{{ $criticality }}" {{ $selectedCriticality === $criticality ? 'selected' : '' }}>{{ $criticality }}</option>
        @endforeach
    </select>
</div>

<div class="col-md-3">
    <label for="repeat_watch" class="form-label">Repeat Watch</label>
    <select id="repeat_watch" name="repeat_watch" class="form-select" required>
        <option value="0" {{ $repeatWatch === 0 ? 'selected' : '' }}>No</option>
        <option value="1" {{ $repeatWatch === 1 ? 'selected' : '' }}>Yes</option>
    </select>
</div>

<div class="col-md-6">
    <label for="remarks" class="form-label">Remarks</label>
    <textarea id="remarks" name="remarks" class="form-control" rows="3" placeholder="Installation note, risk note, or monitoring comment">{{ old('remarks', $record->remarks) }}</textarea>
</div>
