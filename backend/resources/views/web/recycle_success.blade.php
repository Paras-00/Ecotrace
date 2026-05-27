@extends('layouts.app')

@section('content')
<div class="card" style="max-width: 600px; margin: 0 auto; text-align: center;">
    <div style="font-size: 4rem; color: var(--primary); margin-bottom: 1rem;">
        🎉
    </div>

    <!-- Unit IV: Accessing Session flash notification -->
    @if (session('success_flash'))
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--primary); border-radius: 6px; padding: 1rem; margin-bottom: 2rem; color: #34d399;">
            {{ session('success_flash') }}
        </div>
    @endif

    <h2 style="margin-top: 0; color: white;">Submission Successful!</h2>
    <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem;">
        You have successfully registered your <strong>{{ $recycleRequest->device_brand }} {{ $recycleRequest->device_model }}</strong> for recycling.
    </p>

    <!-- Unit IV: Accessing Session credit points -->
    <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2.5rem;">
        <span style="font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Estimated Green Credits</span>
        <h1 style="color: var(--primary); margin: 0.5rem 0; font-size: 3rem; font-weight: 800;">
            +{{ session('last_earned_points', $recycleRequest->credit_points) }}
        </h1>
        <p style="margin: 0; font-size: 0.9rem; color: var(--text-muted);">Points will be activated upon physical device inspection.</p>
    </div>

    <div style="text-align: left; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 1.25rem; margin-bottom: 2.5rem; border: 1px solid var(--border-color);">
        <h4 style="margin-top: 0; margin-bottom: 0.75rem; color: white;">Recycle Slip Details:</h4>
        <ul style="margin: 0; padding-left: 1.2rem; color: var(--text-muted); line-height: 1.6; font-size: 0.95rem;">
            <li><strong>Receipt ID:</strong> {{ $recycleRequest->id }}</li>
            <li><strong>Serial Number:</strong> {{ $recycleRequest->serial_number }}</li>
            <li><strong>Submitter Name:</strong> {{ $recycleRequest->user_name }}</li>
            <li><strong>Email:</strong> {{ $recycleRequest->user_email }}</li>
            <li><strong>Status:</strong> <span style="text-transform: uppercase; color: var(--primary); font-weight: bold;">{{ $recycleRequest->status }}</span></li>
        </ul>
    </div>

    <div style="display: flex; gap: 1rem; justify-content: center;">
        <a href="{{ route('recycle.form') }}" class="btn">
            Recycle Another Device
        </a>
        <a href="{{ route('home') }}" class="btn" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: white;">
            Back to Home
        </a>
    </div>
</div>
@endsection
