<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class AccessPreviewController extends Controller
{
    public function dashboard(Request $request): View
    {
        $user = $request->user()->loadMissing(['roles.permissions', 'department', 'shift', 'factoryUnit']);
        $modules = $this->moduleCardsFor($request);

        return view('app.dashboard', [
            'user' => $user,
            'modules' => $modules,
            'accessibleModules' => $modules->where('granted', true)->values(),
            'pageTitle' => 'Access Dashboard',
            'pageSubtitle' => 'Runtime authentication and module permission preview',
            'currentModuleKey' => 'dashboard',
        ]);
    }

    public function module(Request $request, string $module): View
    {
        $definition = config("access.modules.{$module}");
        abort_unless(is_array($definition), 404);

        $user = $request->user()->loadMissing(['roles.permissions', 'department', 'shift', 'factoryUnit']);
        $modules = $this->moduleCardsFor($request);

        return view('app.module-preview', [
            'user' => $user,
            'modules' => $modules,
            'module' => array_merge($definition, [
                'key' => $module,
                'granted' => $user->canAccessModule($module),
                'gate' => "module.{$module}",
            ]),
            'pageTitle' => $definition['label'],
            'pageSubtitle' => 'Protected module access preview',
            'currentModuleKey' => $module,
        ]);
    }

    protected function moduleCardsFor(Request $request): Collection
    {
        $user = $request->user();

        return collect(config('access.modules', []))
            ->map(function (array $module, string $key) use ($user): array {
                return [
                    'key' => $key,
                    'label' => $module['label'],
                    'description' => $module['description'],
                    'permission' => $module['permission'],
                    'granted' => $user->canAccessModule($key),
                    'url' => route('app.modules.show', ['module' => $key]),
                ];
            })
            ->values();
    }
}
