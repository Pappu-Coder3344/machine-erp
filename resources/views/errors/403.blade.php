<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>403 | LML Machine Management</title>
    <link rel="icon" type="image/jpeg" href="{{ url('/prototype-assets/img/logo.jpg') }}?v=20260424">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ url('/prototype-assets/css/style.css') }}?v=20260424">
    <link rel="stylesheet" href="{{ url('/prototype-assets/css/pages.css') }}?v=20260424">
</head>
<body>
    <main class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-7">
                <div class="erp-card">
                    <div class="text-center mb-4">
                        <img src="{{ url('/prototype-assets/img/logo.jpg') }}?v=20260424" alt="Louietex logo" style="height: 64px; width: auto;">
                    </div>
                    <h1 class="page-title text-center mb-2">Access Restricted</h1>
                    <p class="page-subtitle text-center mb-4">
                        The signed-in role does not have permission to open this module preview.
                    </p>
                    <div class="compact-note">
                        This restriction is now enforced by backend middleware and role-permission mapping so later CRUD and workflow phases can stay secure.
                    </div>
                    <div class="d-flex justify-content-center gap-2 mt-4">
                        @auth
                            <a href="{{ route('app.dashboard') }}" class="btn btn-primary">Back to Access Dashboard</a>
                        @else
                            <a href="{{ route('login') }}" class="btn btn-primary">Back to Login</a>
                        @endauth
                    </div>
                </div>
            </div>
        </div>
    </main>
</body>
</html>
