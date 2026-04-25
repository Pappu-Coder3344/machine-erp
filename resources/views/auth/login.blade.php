<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login | LML Machine Management</title>
    <link rel="icon" type="image/jpeg" href="{{ url('/prototype-assets/img/logo.jpg') }}?v=20260424">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ url('/prototype-assets/css/style.css') }}?v=20260424">
    <link rel="stylesheet" href="{{ url('/prototype-assets/css/pages.css') }}?v=20260424">
</head>
<body class="login-page">
    <main class="login-layout">
        <section class="login-brand-panel">
            <div class="login-brand-box">
                <div class="login-brand-logo-wrap">
                    <img src="{{ url('/prototype-assets/img/logo.jpg') }}?v=20260424" alt="Louietex logo" class="login-brand-logo">
                </div>
                <span class="login-brand-tag">LML MACHINE MANAGEMENT</span>
                <h1 class="login-heading">Garments factory machine maintenance and rent machine control in one simple system.</h1>
                <p class="login-lead">
                    Track machine master, rent machines, breakdown complaints, preventive maintenance, vendors, agreements, and reports with a clean ERP workflow.
                </p>
            </div>

            <div class="login-info-card">
                <h2 class="login-section-title">What this backend auth phase enables</h2>
                <div class="login-feature-list">
                    <div class="login-feature-item">
                        <strong>Secure Login</strong>
                        <span>Username, email, or employee code sign-in using Laravel session authentication.</span>
                    </div>
                    <div class="login-feature-item">
                        <strong>Role And Permission Control</strong>
                        <span>Seeded roles and permissions are now enforced at runtime for future module phases.</span>
                    </div>
                    <div class="login-feature-item">
                        <strong>Ready For Later Modules</strong>
                        <span>Setup, machine, rent, breakdown, PM, store, reports, and user access can now be protected centrally.</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="login-form-panel">
            <div class="login-card">
                <div class="login-card-header">
                    <div class="login-logo-wrap">
                        <img src="{{ url('/prototype-assets/img/logo.jpg') }}?v=20260424" alt="Louietex logo" class="login-logo-image">
                    </div>
                    <div>
                        <h2 class="login-title">Sign In</h2>
                        <p class="login-subtitle mb-0">Use seeded local demo users to test login and role-based access.</p>
                    </div>
                </div>

                <form method="POST" action="{{ route('login.store') }}" class="row g-3">
                    @csrf

                    <div class="col-12">
                        <label for="login" class="form-label">User ID / Email / Employee Code</label>
                        <input
                            type="text"
                            class="form-control form-control-lg @error('login') is-invalid @enderror"
                            id="login"
                            name="login"
                            placeholder="Enter user ID, email, or employee code"
                            value="{{ old('login', 'admin.lml') }}"
                            autofocus
                        >
                        @error('login')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="col-12">
                        <label for="password" class="form-label">Password</label>
                        <div class="input-group input-group-lg">
                            <input
                                type="password"
                                class="form-control @error('password') is-invalid @enderror"
                                id="password"
                                name="password"
                                placeholder="Enter password"
                                value="password"
                            >
                            <button class="btn btn-outline-secondary" type="button" id="togglePassword">Show</button>
                        </div>
                        @error('password')
                            <div class="invalid-feedback d-block">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="col-12">
                        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="1" id="remember" name="remember" {{ old('remember', true) ? 'checked' : '' }}>
                                <label class="form-check-label" for="remember">
                                    Keep me signed in on this device
                                </label>
                            </div>
                            <span class="small text-muted">Seeded demo password: <strong>password</strong></span>
                        </div>
                    </div>

                    <div class="col-12">
                        @if (session('status'))
                            <div class="alert alert-success mb-0" role="alert">
                                {{ session('status') }}
                            </div>
                        @else
                            <div class="alert alert-info mb-0" role="alert">
                                Backend auth is active for local development and seeded runtime testing.
                            </div>
                        @endif
                    </div>

                    <div class="col-12 d-grid">
                        <button type="submit" class="btn btn-primary btn-lg">Login to Dashboard</button>
                    </div>
                </form>

                <div class="demo-access-card">
                    <div class="d-flex justify-content-between align-items-center gap-3 mb-3">
                        <div>
                            <h3 class="demo-title">Quick Demo Access</h3>
                            <p class="demo-text mb-0">Click any user to fill the login ID. All demo users use the password <strong>password</strong>.</p>
                        </div>
                    </div>

                    <div class="demo-role-grid">
                        @foreach ($quickDemoUsers as $demoUser)
                            <button
                                type="button"
                                class="btn btn-outline-primary demo-role-btn"
                                data-login="{{ $demoUser['username'] }}"
                                data-role="{{ $demoUser['role'] }}"
                            >
                                {{ $demoUser['role'] }}
                            </button>
                        @endforeach
                    </div>

                    <div class="table-responsive mt-3">
                        <table class="table table-sm align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>User ID</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($demoUsers as $demoUser)
                                    <tr>
                                        <td>{{ $demoUser['name'] }}</td>
                                        <td><code>{{ $demoUser['username'] }}</code></td>
                                        <td>{{ $demoUser['role'] }}</td>
                                        <td>{{ $demoUser['status'] }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.getElementById('togglePassword')?.addEventListener('click', function () {
            const passwordField = document.getElementById('password');

            if (! passwordField) {
                return;
            }

            const isPassword = passwordField.getAttribute('type') === 'password';
            passwordField.setAttribute('type', isPassword ? 'text' : 'password');
            this.textContent = isPassword ? 'Hide' : 'Show';
        });

        document.querySelectorAll('.demo-role-btn').forEach(function (button) {
            button.addEventListener('click', function () {
                const loginField = document.getElementById('login');
                const passwordField = document.getElementById('password');

                if (loginField) {
                    loginField.value = this.dataset.login || '';
                }

                if (passwordField && ! passwordField.value) {
                    passwordField.value = 'password';
                }
            });
        });
    </script>
</body>
</html>
