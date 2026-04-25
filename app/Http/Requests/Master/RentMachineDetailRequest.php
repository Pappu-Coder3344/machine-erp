<?php

namespace App\Http\Requests\Master;

use App\Enums\ReturnReplaceStatus;
use App\Http\Requests\Crud\CrudRequest;
use App\Models\Agreement;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class RentMachineDetailRequest extends CrudRequest
{
    protected function permissionSlug(): string
    {
        return $this->isMethod('POST') ? 'rent-machines.receive' : 'rent-machines.update';
    }

    protected function rulesForStore(): array
    {
        return [
            'machine_id' => ['required', 'exists:machines,id', 'unique:rent_machine_details,machine_id'],
            'vendor_id' => ['nullable', 'exists:vendors,id'],
            'agreement_id' => ['nullable', 'exists:agreements,id'],
            'asset_tag' => ['nullable', 'string', 'max:50', 'unique:rent_machine_details,asset_tag'],
            'receive_date' => ['nullable', 'date'],
            'monthly_rent' => ['nullable', 'numeric', 'min:0'],
            'return_replace_status' => ['required', Rule::in(collect(ReturnReplaceStatus::cases())->map(fn (ReturnReplaceStatus $case) => $case->value)->all())],
            'contract_notes' => ['nullable', 'string'],
        ];
    }

    protected function rulesForUpdate(): array
    {
        return [
            'machine_id' => ['required', 'exists:machines,id', $this->uniqueRule('rent_machine_details', 'machine_id', 'rentMachineDetail')],
            'vendor_id' => ['nullable', 'exists:vendors,id'],
            'agreement_id' => ['nullable', 'exists:agreements,id'],
            'asset_tag' => ['nullable', 'string', 'max:50', $this->uniqueRule('rent_machine_details', 'asset_tag', 'rentMachineDetail')],
            'receive_date' => ['nullable', 'date'],
            'monthly_rent' => ['nullable', 'numeric', 'min:0'],
            'return_replace_status' => ['required', Rule::in(collect(ReturnReplaceStatus::cases())->map(fn (ReturnReplaceStatus $case) => $case->value)->all())],
            'contract_notes' => ['nullable', 'string'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if (! $this->filled('agreement_id')) {
                return;
            }

            $agreement = Agreement::query()->find($this->input('agreement_id'));

            if (! $agreement) {
                return;
            }

            if ($this->filled('vendor_id') && (int) $agreement->vendor_id !== (int) $this->input('vendor_id')) {
                $validator->errors()->add('agreement_id', 'The selected agreement does not belong to the selected vendor.');
            }
        });
    }
}
