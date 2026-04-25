<?php

namespace App\Http\Requests\Crud;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

abstract class CrudRequest extends FormRequest
{
    abstract protected function permissionSlug(): string;

    abstract protected function rulesForStore(): array;

    abstract protected function rulesForUpdate(): array;

    public function authorize(): bool
    {
        $user = $this->user();

        return $user && $user->hasPermission($this->permissionSlug());
    }

    public function rules(): array
    {
        return $this->isMethod('POST')
            ? $this->rulesForStore()
            : $this->rulesForUpdate();
    }

    protected function uniqueRule(string $table, string $column, string $routeParameter): Unique
    {
        $record = $this->route($routeParameter);
        $ignoreId = is_object($record) && method_exists($record, 'getKey')
            ? $record->getKey()
            : $record;

        return Rule::unique($table, $column)->ignore($ignoreId);
    }
}
