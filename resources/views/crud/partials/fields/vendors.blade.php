@php
    $selectedStatus = (string) old('status', $record->status ?: 'Active');
@endphp

<div class="col-md-3">
    <label for="code" class="form-label">Vendor Code</label>
    <input type="text" id="code" name="code" class="form-control" value="{{ old('code', $record->code) }}" required>
</div>

<div class="col-md-5">
    <label for="name" class="form-label">Vendor Name</label>
    <input type="text" id="name" name="name" class="form-control" value="{{ old('name', $record->name) }}" required>
</div>

<div class="col-md-4">
    <label for="type" class="form-label">Vendor Type</label>
    <input type="text" id="type" name="type" class="form-control" value="{{ old('type', $record->type) }}" placeholder="Example: Rent Machine Supplier" required>
</div>

<div class="col-md-3">
    <label for="city" class="form-label">City</label>
    <input type="text" id="city" name="city" class="form-control" value="{{ old('city', $record->city) }}">
</div>

<div class="col-md-3">
    <label for="contact_person" class="form-label">Contact Person</label>
    <input type="text" id="contact_person" name="contact_person" class="form-control" value="{{ old('contact_person', $record->contact_person) }}">
</div>

<div class="col-md-3">
    <label for="contact_role" class="form-label">Contact Role</label>
    <input type="text" id="contact_role" name="contact_role" class="form-control" value="{{ old('contact_role', $record->contact_role) }}">
</div>

<div class="col-md-3">
    <label for="status" class="form-label">Status</label>
    <select id="status" name="status" class="form-select" required>
        <option value="Active" {{ $selectedStatus === 'Active' ? 'selected' : '' }}>Active</option>
        <option value="Pending Approval" {{ $selectedStatus === 'Pending Approval' ? 'selected' : '' }}>Pending Approval</option>
        <option value="Inactive" {{ $selectedStatus === 'Inactive' ? 'selected' : '' }}>Inactive</option>
    </select>
</div>

<div class="col-md-3">
    <label for="phone" class="form-label">Phone</label>
    <input type="text" id="phone" name="phone" class="form-control" value="{{ old('phone', $record->phone) }}">
</div>

<div class="col-md-3">
    <label for="office_phone" class="form-label">Office Phone</label>
    <input type="text" id="office_phone" name="office_phone" class="form-control" value="{{ old('office_phone', $record->office_phone) }}">
</div>

<div class="col-md-3">
    <label for="email" class="form-label">Email</label>
    <input type="email" id="email" name="email" class="form-control" value="{{ old('email', $record->email) }}">
</div>

<div class="col-md-3">
    <label for="response_hours" class="form-label">Response Hours</label>
    <input type="number" id="response_hours" name="response_hours" class="form-control" min="0" max="999" value="{{ old('response_hours', $record->response_hours) }}">
</div>

<div class="col-12">
    <label for="address" class="form-label">Address</label>
    <input type="text" id="address" name="address" class="form-control" value="{{ old('address', $record->address) }}">
</div>

<div class="col-12">
    <label for="notes" class="form-label">Notes</label>
    <textarea id="notes" name="notes" class="form-control" rows="3" placeholder="Service scope, escalation note, or response expectation">{{ old('notes', $record->notes) }}</textarea>
</div>
