<?php

namespace App\Http\Requests\Master;

use App\Http\Requests\Crud\CrudRequest;
use App\Models\Line;
use Illuminate\Validation\Validator;

class MachineAllocationRequest extends CrudRequest
{
    protected function permissionSlug(): string
    {
        return 'allocation.create';
    }

    protected function rulesForStore(): array
    {
        return [
            'machine_id' => ['required', 'exists:machines,id'],
            'from_floor_id' => ['nullable', 'exists:floors,id'],
            'from_line_id' => ['nullable', 'exists:lines,id'],
            'to_floor_id' => ['nullable', 'exists:floors,id'],
            'to_line_id' => ['nullable', 'exists:lines,id'],
            'allocated_by_user_id' => ['nullable', 'exists:users,id'],
            'allocation_type' => ['required', 'string', 'max:50'],
            'allocated_at' => ['required', 'date'],
            'reason' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:50'],
            'remarks' => ['nullable', 'string'],
        ];
    }

    protected function rulesForUpdate(): array
    {
        return $this->rulesForStore();
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $this->validateLineMatchesFloor($validator, 'from_line_id', 'from_floor_id');
            $this->validateLineMatchesFloor($validator, 'to_line_id', 'to_floor_id');
        });
    }

    protected function validateLineMatchesFloor(Validator $validator, string $lineField, string $floorField): void
    {
        if (! $this->filled($lineField) || ! $this->filled($floorField)) {
            return;
        }

        $line = Line::query()->find($this->input($lineField));

        if ($line && (int) $line->floor_id !== (int) $this->input($floorField)) {
            $validator->errors()->add($lineField, 'The selected line does not belong to the selected floor.');
        }
    }
}
