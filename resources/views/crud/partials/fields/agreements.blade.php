@php
    $selectedVendor = (string) old('vendor_id', $record->vendor_id);
    $selectedStatus = (string) old('status', $record->status ?: 'Draft');
    $selectedRenewalRisk = (string) old('renewal_risk', $record->renewal_risk);
@endphp

<div class="col-md-4">
    <label for="vendor_id" class="form-label">Vendor</label>
    <select id="vendor_id" name="vendor_id" class="form-select" required>
        <option value="">Select vendor</option>
        @foreach ($formData['vendors'] as $vendor)
            <option value="{{ $vendor->id }}" {{ $selectedVendor === (string) $vendor->id ? 'selected' : '' }}>
                {{ $vendor->name }} ({{ $vendor->code }})
            </option>
        @endforeach
    </select>
</div>

<div class="col-md-4">
    <label for="code" class="form-label">Agreement Code</label>
    <input type="text" id="code" name="code" class="form-control" value="{{ old('code', $record->code) }}" required>
</div>

<div class="col-md-4">
    <label for="type" class="form-label">Agreement Type</label>
    <input type="text" id="type" name="type" class="form-control" value="{{ old('type', $record->type) }}" placeholder="Example: Annual Rent Support" required>
</div>

<div class="col-md-3">
    <label for="start_date" class="form-label">Start Date</label>
    <input type="date" id="start_date" name="start_date" class="form-control" value="{{ old('start_date', $record->start_date?->format('Y-m-d')) }}" required>
</div>

<div class="col-md-3">
    <label for="end_date" class="form-label">End Date</label>
    <input type="date" id="end_date" name="end_date" class="form-control" value="{{ old('end_date', $record->end_date?->format('Y-m-d')) }}" required>
</div>

<div class="col-md-3">
    <label for="monthly_cost" class="form-label">Monthly Cost (BDT)</label>
    <input type="number" id="monthly_cost" name="monthly_cost" class="form-control" min="0" step="0.01" value="{{ old('monthly_cost', $record->monthly_cost) }}">
</div>

<div class="col-md-3">
    <label for="status" class="form-label">Status</label>
    <select id="status" name="status" class="form-select" required>
        <option value="Draft" {{ $selectedStatus === 'Draft' ? 'selected' : '' }}>Draft</option>
        <option value="Active" {{ $selectedStatus === 'Active' ? 'selected' : '' }}>Active</option>
        <option value="Expiring Soon" {{ $selectedStatus === 'Expiring Soon' ? 'selected' : '' }}>Expiring Soon</option>
        <option value="Expired" {{ $selectedStatus === 'Expired' ? 'selected' : '' }}>Expired</option>
        <option value="Blocked" {{ $selectedStatus === 'Blocked' ? 'selected' : '' }}>Blocked</option>
    </select>
</div>

<div class="col-md-8">
    <label for="coverage" class="form-label">Coverage</label>
    <input type="text" id="coverage" name="coverage" class="form-control" value="{{ old('coverage', $record->coverage) }}" placeholder="Machines, service window, or support coverage">
</div>

<div class="col-md-4">
    <label for="renewal_risk" class="form-label">Renewal Risk</label>
    <select id="renewal_risk" name="renewal_risk" class="form-select">
        <option value="">Not set</option>
        <option value="Low" {{ $selectedRenewalRisk === 'Low' ? 'selected' : '' }}>Low</option>
        <option value="Medium" {{ $selectedRenewalRisk === 'Medium' ? 'selected' : '' }}>Medium</option>
        <option value="High" {{ $selectedRenewalRisk === 'High' ? 'selected' : '' }}>High</option>
    </select>
</div>

<div class="col-md-6">
    <label for="terms" class="form-label">Terms</label>
    <textarea id="terms" name="terms" class="form-control" rows="3" placeholder="Commercial or service terms">{{ old('terms', $record->terms) }}</textarea>
</div>

<div class="col-md-6">
    <label for="notes" class="form-label">Notes</label>
    <textarea id="notes" name="notes" class="form-control" rows="3" placeholder="Operational comment or review note">{{ old('notes', $record->notes) }}</textarea>
</div>
