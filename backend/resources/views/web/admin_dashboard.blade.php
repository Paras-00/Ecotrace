@extends('layouts.app')

@section('content')
<div style="margin-bottom: 2rem;">
    <h1 style="margin-top:0; color: white;">E-Waste Administration Dashboard</h1>
    <p style="color: var(--text-muted);">Manage incoming recycling submissions and monitor precious metal recovery values.</p>
</div>

<!-- Admin Success/Error Messages -->
@if (session('admin_success'))
    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--primary); border-radius: 6px; padding: 1rem; margin-bottom: 1.5rem; color: #34d399;">
        {{ session('admin_success') }}
    </div>
@endif

@if (session('admin_error'))
    <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); border-radius: 6px; padding: 1rem; margin-bottom: 1.5rem; color: #f87171;">
        {{ session('admin_error') }}
    </div>
@endif

<!-- Precious Metal Recovery Statistics Dashboard -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
    <div style="background: rgba(251, 191, 36, 0.05); border: 1px solid rgba(251, 191, 36, 0.2); border-radius: 12px; padding: 1.5rem; text-align: center;">
        <span style="font-size: 1.8rem;">✨</span>
        <h4 style="margin: 0.5rem 0 0.25rem 0; color: var(--text-muted); text-transform: uppercase; font-size: 0.8rem;">Gold Recovered</h4>
        <p style="margin: 0; font-size: 1.8rem; font-weight: 800; color: #fbbf24;">{{ $stats['gold'] }} g</p>
    </div>
    <div style="background: rgba(226, 232, 240, 0.05); border: 1px solid rgba(226, 232, 240, 0.2); border-radius: 12px; padding: 1.5rem; text-align: center;">
        <span style="font-size: 1.8rem;">🥈</span>
        <h4 style="margin: 0.5rem 0 0.25rem 0; color: var(--text-muted); text-transform: uppercase; font-size: 0.8rem;">Silver Recovered</h4>
        <p style="margin: 0; font-size: 1.8rem; font-weight: 800; color: #e2e8f0;">{{ $stats['silver'] }} g</p>
    </div>
    <div style="background: rgba(249, 115, 22, 0.05); border: 1px solid rgba(249, 115, 22, 0.2); border-radius: 12px; padding: 1.5rem; text-align: center;">
        <span style="font-size: 1.8rem;">🔌</span>
        <h4 style="margin: 0.5rem 0 0.25rem 0; color: var(--text-muted); text-transform: uppercase; font-size: 0.8rem;">Copper Recovered</h4>
        <p style="margin: 0; font-size: 1.8rem; font-weight: 800; color: #f97316;">{{ $stats['copper'] }} kg</p>
    </div>
    <div style="background: rgba(14, 165, 233, 0.05); border: 1px solid rgba(14, 165, 233, 0.2); border-radius: 12px; padding: 1.5rem; text-align: center;">
        <span style="font-size: 1.8rem;">🔋</span>
        <h4 style="margin: 0.5rem 0 0.25rem 0; color: var(--text-muted); text-transform: uppercase; font-size: 0.8rem;">Palladium Recovered</h4>
        <p style="margin: 0; font-size: 1.8rem; font-weight: 800; color: #0ea5e9;">{{ $stats['palladium'] }} g</p>
    </div>
</div>

<!-- List of Recycling Submissions -->
<div class="card" style="padding: 1.5rem; overflow-x: auto;">
    <h3 style="margin-top: 0; margin-bottom: 1.25rem; color: white;">Recycling Request Log (MongoDB)</h3>
    @if ($requests->count() == 0)
        <p style="color: var(--text-muted); text-align: center; padding: 2rem;">No recycling requests submitted yet. Be the first to recycle!</p>
    @else
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
            <thead>
                <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-muted);">
                    <th style="padding: 0.75rem 0.5rem;">Device</th>
                    <th style="padding: 0.75rem 0.5rem;">Serial No.</th>
                    <th style="padding: 0.75rem 0.5rem;">Submitter</th>
                    <th style="padding: 0.75rem 0.5rem;">Target Facility</th>
                    <th style="padding: 0.75rem 0.5rem;">Photo</th>
                    <th style="padding: 0.75rem 0.5rem;">Credits</th>
                    <th style="padding: 0.75rem 0.5rem;">Status</th>
                    <th style="padding: 0.75rem 0.5rem; text-align: right;">Action</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($requests as $req)
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.03); color: var(--text-main);">
                        <td style="padding: 1rem 0.5rem;">
                            <strong>{{ $req->device_brand }}</strong><br>
                            <span style="font-size: 0.85rem; color: var(--text-muted);">{{ $req->device_model }}</span>
                        </td>
                        <td style="padding: 1rem 0.5rem; font-family: monospace;">{{ $req->serial_number }}</td>
                        <td style="padding: 1rem 0.5rem;">
                            {{ $req->user_name }}<br>
                            <span style="font-size: 0.85rem; color: var(--text-muted);">{{ $req->user_email }}</span>
                        </td>
                        <td style="padding: 1rem 0.5rem; font-size: 0.85rem;">
                            @if($req->facility)
                                {{ $req->facility->name }}<br>
                                <span style="color:var(--text-muted);">{{ $req->facility->city }}</span>
                            @else
                                <span style="color:var(--danger);">Unknown Facility</span>
                            @endif
                        </td>
                        <td style="padding: 1rem 0.5rem;">
                            @if ($req->image_path)
                                <a href="{{ asset('storage/' . $req->image_path) }}" target="_blank">
                                    <img src="{{ asset('storage/' . $req->image_path) }}" alt="device" 
                                         style="width: 45px; height: 45px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color);">
                                </a>
                            @else
                                <span style="color: var(--text-muted);">No image</span>
                            @endif
                        </td>
                        <td style="padding: 1rem 0.5rem; font-weight: bold; color: var(--primary);">+{{ $req->credit_points }}</td>
                        <td style="padding: 1rem 0.5rem;">
                            <span style="background: rgba(16, 185, 129, 0.1); color: var(--primary); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; text-transform: uppercase;">
                                {{ $req->status }}
                            </span>
                        </td>
                        <td style="padding: 1rem 0.5rem; text-align: right;">
                            <!-- Unit V: CSRF & Method field for DELETE request -->
                            <form action="{{ route('admin.destroy', $req->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this submission?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">
                                    Archive
                                </button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
</div>
@endsection
