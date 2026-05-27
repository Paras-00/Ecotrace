<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>EcoTrace Portal - E-Waste Recycling</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0b0f19;
            --card-bg: rgba(255, 255, 255, 0.03);
            --border-color: rgba(255, 255, 255, 0.08);
            --primary: #10b981;
            --primary-hover: #059669;
            --text-main: #f1f5f9;
            --text-muted: #94a3b8;
            --danger: #ef4444;
        }

        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        header {
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border-color);
            position: sticky;
            top: 0;
            z-index: 50;
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--primary);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .nav-links {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }

        .nav-links a {
            color: var(--text-main);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
        }

        .nav-links a:hover {
            color: var(--primary);
        }

        .lang-switcher {
            display: flex;
            gap: 0.5rem;
            background: rgba(255, 255, 255, 0.05);
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
            border: 1px solid var(--border-color);
        }

        .lang-switcher a {
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            text-decoration: none;
            font-size: 0.85rem;
            color: var(--text-muted);
            font-weight: bold;
        }

        .lang-switcher a.active {
            background: var(--primary);
            color: white;
        }

        main {
            flex: 1;
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 2rem;
            width: calc(100% - 4rem);
        }

        .global-stats {
            background: rgba(16, 185, 129, 0.05);
            border: 1px solid rgba(16, 185, 129, 0.2);
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            display: flex;
            justify-content: space-around;
            text-align: center;
        }

        .stat-item h4 {
            margin: 0;
            color: var(--text-muted);
            font-size: 0.9rem;
            text-transform: uppercase;
        }

        .stat-item p {
            margin: 0.5rem 0 0 0;
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--primary);
        }

        footer {
            background: rgba(15, 23, 42, 0.9);
            border-top: 1px solid var(--border-color);
            padding: 1.5rem 2rem;
            text-align: center;
            color: var(--text-muted);
            font-size: 0.9rem;
            margin-top: auto;
        }

        /* Common Components */
        .btn {
            background: var(--primary);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            border: none;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s;
            display: inline-block;
        }

        .btn:hover {
            background: var(--primary-hover);
            transform: translateY(-1px);
        }

        .btn-danger {
            background: var(--danger);
        }
        .btn-danger:hover {
            background: #b91c1c;
        }

        .card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
        }
    </style>
</head>
<body>
    <header>
        <div class="nav-container">
            <a href="{{ route('home') }}" class="logo">
                ♻️ EcoTrace
            </a>
            <div class="nav-links">
                <a href="{{ route('home') }}">{{ __('messages.welcome') }}</a>
                <a href="{{ route('recycle.form') }}">{{ __('messages.recycle_now') }}</a>
                <a href="{{ route('admin.dashboard') }}">{{ __('messages.dashboard') }}</a>
                
                <div class="lang-switcher">
                    <a href="{{ route('lang.switch', 'en') }}" class="{{ app()->getLocale() == 'en' ? 'active' : '' }}">EN</a>
                    <a href="{{ route('lang.switch', 'es') }}" class="{{ app()->getLocale() == 'es' ? 'active' : '' }}">ES</a>
                    <a href="{{ route('lang.switch', 'hi') }}" class="{{ app()->getLocale() == 'hi' ? 'active' : '' }}">HI</a>
                </div>
            </div>
        </div>
    </header>

    <main>
        <!-- Unit II: Sharing Data with all Views -->
        <!-- Demonstrating global stats provided by AppServiceProvider view composer -->
        <div class="global-stats">
            <div class="stat-item">
                <h4>Total Recycling Submissions</h4>
                <p>{{ $global_total_submissions }} Devices</p>
            </div>
            <div class="stat-item">
                <h4>Total Credit Points Awarded</h4>
                <p>{{ $global_total_points }} PTS</p>
            </div>
        </div>

        @yield('content')
    </main>

    <footer>
        <p>&copy; 2026 EcoTrace Platform. Powered by Laravel + MongoDB. Fostering a cleaner future.</p>
    </footer>
</body>
</html>
