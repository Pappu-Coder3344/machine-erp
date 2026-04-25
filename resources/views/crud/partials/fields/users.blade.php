@php
    $selectedDepartment = (string) old('department_id', $record->department_id);
    $selectedShift = (string) old('shift_id', $record->shift_id);
    $selectedFactoryUnit = (string) old('factory_unit_id', $record->factory_unit_id);
    $selectedRole = (string) old('role_id', $record->primaryRole()?->id);
    $selectedStatus = (string) old('status', $record->status?->value ?? $record->status ?? 'Active');
@endphp

<div class="col-md-3">
    <label for="employee_code" class="form-label">Employee Code</label>
    <input type="text" id="employee_code" name="employee_code" class="form-control" value="{{ old('employee_code', $record->employee_code) }}">
</div>

<div class="col-md-5">
    <label for="name" class="form-label">Full Name</label>
    <input type="text" id="name" name="name" class="form-control" value="{{ old('name', $record->name) }}" required>
</div>

<div class="col-md-4">
    <label for="designation" class="form-label">Designation</label>
    <input type="text" id="designation" name="designation" class="form-control" value="{{ old('designation', $record->designation) }}" placeholder="Example: Supervisor">
</div>

<div class="col-md-4">
    <label for="username" class="form-label">Username</label>
    <input type="text" id="username" name="username" class="form-control" value="{{ old('username', $record->username) }}" required>
</div>

<div class="col-md-4">
    <label for="email" class="form-label">Email</label>
    <input type="email" id="email" name="email" class="form-control" value="{{ old('email', $record->email) }}">
</div>

<div class="col-md-4">
    <label for="phone" class="form-label">Phone</label>
    <input type="text" id="phone" name="phone" class="form-control" value="{{ old('phone', $record->phone) }}">
</div>

<div class="col-md-4">
    <label for="department_id" class="form-label">Department</label>
    <select id="department_id" name="department_id" class="form-select">
        <option value="">No department</option>
        @foreach ($formData['departments'] as $department)
            <option value="{{ $department->id }}" {{ $selectedDepartment === (string) $department->id ? 'selected' : '' }}>
                {{ $department->name }}
            </option>
        @endforeach
    </select>
</div>

<div class="col-md-4">
    <label for="shift_id" class="form-label">Shift</label>
    <select id="shift_id" name="shift_id" class="form-select">
        <option value="">No shift</option>
        @foreach ($formData['shifts'] as $shift)
            <option value="{{ $shift->id }}" {{ $selectedShift === (string) $shift->id ? 'selected' : '' }}>
                {{ $shift->name }}
            </option>
        @endforeach
    </select>
</div>

<div class="col-md-4">
    <label for="factory_unit_id" class="form-label">Factory Unit</label>
    <select id="factory_unit_id" name="factory_unit_id" class="form-select">
        <option value="">No factory unit</option>
        @foreach ($formData['factoryUnits'] as $factoryUnit)
            <option value="{{ $factoryUnit->id }}" {{ $selectedFactoryUnit === (string) $factoryUnit->id ? 'selected' : '' }}>
                {{ $factoryUnit->name }}
            </option>
        @endforeach
    </select>
</div>

<div class="col-md-4">
    <label for="role_id" class="form-label">Role</label>
    <select id="role_id" name="role_id" class="form-select" required>
        <option value="">Select role</option>
        @foreach ($formData['roles'] as $role)
            <option value="{{ $role->id }}" {{ $selectedRole === (string) $role->id ? 'selected' : '' }}>
                {{ $role->name }}
            </option>
        @endforeach
    </select>
</div>

<div class="col-md-4">
    <label for="status" class="form-label">Status</label>
    <select id="status" name="status" class="form-select" required>
        @foreach ($formData['statuses'] as $status)
            <option value="{{ $status }}" {{ $selectedStatus === $status ? 'selected' : '' }}>{{ $status }}</option>
        @endforeach
    </select>
</div>

<div class="col-md-4">
    <label for="password" class="form-label">Password</label>
    <input type="password" id="password" name="password" class="form-control" {{ $record->exists ? '' : 'required' }}>
    <div class="form-text">
        {{ $record->exists ? 'Leave blank to keep the current password.' : 'Use at least 8 characters.' }}
    </div>
</div>
