<?php

namespace App\Http\Requests\Master;

use App\Http\Requests\Crud\CrudRequest;

class VendorRequest extends CrudRequest
{
    protected function permissionSlug(): string
    {
        return $this->isMethod('POST') ? 'vendors.create' : 'vendors.update';
    }

    protected function rulesForStore(): array
    {
        return [
            'code' => ['required', 'string', 'max:50', 'unique:vendors,code'],
            'name' => ['required', 'string', 'max:150'],
            'type' => ['required', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'contact_person' => ['nullable', 'string', 'max:150'],
            'contact_role' => ['nullable', 'string', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'office_phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:50'],
            'response_hours' => ['nullable', 'integer', 'min:0', 'max:999'],
            'notes' => ['nullable', 'string'],
        ];
    }

    protected function rulesForUpdate(): array
    {
        return [
            'code' => ['required', 'string', 'max:50', $this->uniqueRule('vendors', 'code', 'vendor')],
            'name' => ['required', 'string', 'max:150'],
            'type' => ['required', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'contact_person' => ['nullable', 'string', 'max:150'],
            'contact_role' => ['nullable', 'string', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'office_phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:50'],
            'response_hours' => ['nullable', 'integer', 'min:0', 'max:999'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
