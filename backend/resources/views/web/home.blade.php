@extends('layouts.app')

@section('content')
<div class="card" style="text-align: center; max-width: 800px; margin: 0 auto; padding: 3rem 2rem;">
    <h1 style="font-size: 3rem; margin: 0 0 1rem 0; color: #fff;">
        {{ __('messages.welcome') }}
    </h1>
    <p style="font-size: 1.25rem; color: var(--text-muted); margin-bottom: 2.5rem; line-height: 1.8;">
        {{ __('messages.tagline') }}
    </p>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; text-align: left;">
            <h3 style="margin-top:0; color:var(--primary);">Step 1</h3>
            <p style="color:var(--text-muted); font-size:0.95rem; margin:0;">Choose from our list of registered collection points.</p>
        </div>
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; text-align: left;">
            <h3 style="margin-top:0; color:var(--primary);">Step 2</h3>
            <p style="color:var(--text-muted); font-size:0.95rem; margin:0;">Input device brand, model, and serial number. Upload picture verification.</p>
        </div>
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; text-align: left;">
            <h3 style="margin-top:0; color:var(--primary);">Step 3</h3>
            <p style="color:var(--text-muted); font-size:0.95rem; margin:0;">Deliver the item and claim your eco-credits instantly!</p>
        </div>
    </div>

    <div style="display: flex; gap: 1rem; justify-content: center;">
        <a href="{{ route('recycle.form') }}" class="btn">
            {{ __('messages.recycle_now') }}
        </a>
        <a href="{{ route('admin.dashboard') }}" class="btn" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: white;">
            {{ __('messages.dashboard') }}
        </a>
    </div>
</div>
@endsection
