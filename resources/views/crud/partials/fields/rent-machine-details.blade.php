@php
    $selectedMachine = (string) old('machine_id', $record->machine_id);
    $selectedVendor = (string) old('vendor_id', $record->vendor_id);
    $selectedAgreement = (string) old('agreement_id', $record->agreement_id);
    $selectedStatus = (string) old('return_replace_status', $record->return_replace_status?->value ?? $record->return_replace_status ?? 'No Request');
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
    <label for="vendor_id" class="form-label">Vendor</label>
    <select id="vendor_id" name="vendor_id" class="form-select">
        <option value="">No vendor</option>
        @foreach ($formData['vendors'] as $vendor)
            <option value="{{ $vendor->id }}" {{ $selectedVendor === (string) $vendor->id ? 'selected' : '' }}>
                {{ $vendor->name }}
            </option>
        @endforeach
    </select>
</div>

<div class="col-md-4">
    <label for="agreement_id" class="form-label">Agreement</label>
    <select id="agreement_id" name="agreement_id" class="form-select">
        <option value="">No agreement</option>
        @foreach ($formData['agreements'] as $agreement)
            <option value="{{ $agreement->id }}" {{ $selectedAgreement === (string) $agreement->id ? 'selected' : '' }}>
                {{ $agreement->code }} - {{ $agreement->vendor?->name }}
            </option>
        @endforeach
    </select>
</div>

<div class="col-md-3">
    <label for="asset_tag" class="form-label">Asset Tag</label>
    <input type="text" id="asset_tag" name="asset_tag" class="form-control" value="{{ old('asset_tag', $record->asset_tag) }}">
</div>

<div class="col-md-3">
    <label for="receive_date" class="form-label">Receive Date</label>
    <input type="date" id="receive_date" name="receive_date" class="form-control" value="{{ old('receive_date', $record->receive_date?->format('Y-m-d')) }}">
</div>

<div class="col-md-3">
    <label for="monthly_rent" class="form-label">Monthly Rent (BDT)</label>
    <input type="number" id="monthly_rent" name="monthly_rent" class="form-control" min="0" step="0.01" value="{{ old('monthly_rent', $record->monthly_rent) }}">
</div>

<div class="col-md-3">
    <label for="return_replace_status" class="form-label">Return / Replace Status</label>
    <select id="return_replace_status" name="return_replace_status" class="form-select" required>
        @foreach ($formData['returnReplaceStatuses'] as $status)
            <option value="{{ $status }}" {{ $selectedStatus === $status ? 'selected' : '' }}>{{ $status }}</option>
        @endforeach
    </select>
</div>

<div class="col-12">
    <label for="contract_notes" class="form-label">Contract Notes</label>
    <textarea id="contract_notes" name="contract_notes" class="form-control" rows="3" placeholder="Commercial or receiving notes for this rent machine">{{ old('contract_notes', $record->contract_notes) }}</textarea>
</div>
