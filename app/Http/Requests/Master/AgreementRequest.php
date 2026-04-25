<?php

namespace App\Http\Requests\Master;

use App\Http\Requests\Crud\CrudRequest;

class AgreementRequest extends CrudRequest
{
    protected function permissionSlug(): string
    {
        return $this->isMethod('POST') ? 'agreements.create' : 'agreements.update';
    }

    protected function rulesForStore(): array
    {
        return [
            'vendor_id' => ['required', 'exists:vendors,id'],
            'code' => ['required', 'string', 'max:50', 'unique:agreements,code'],
            'type' => ['required', 'string', 'max:100'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'coverage' => ['nullable', 'string', 'max:255'],
            'monthly_cost' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'string', 'max:50'],
            'renewal_risk' => ['nullable', 'string', 'max:50'],
            'terms' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ];
    }

    protected function rulesForUpdate(): array
    {
        return [
            'vendor_id' => ['required', 'exists:vendors,id'],
            'code' => ['required', 'string', 'max:50', $this->uniqueRule('agreements', 'code', 'agreement')],
            'type' => ['required', 'string', 'max:100'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'coverage' => ['nullable', 'string', 'max:255'],
            'monthly_cost' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'string', 'max:50'],
            'renewal_risk' => ['nullable', 'string', 'max:50'],
            'terms' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
