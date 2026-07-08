@extends('Admin.layouts.app')
{{-- @dd($users ) --}}

@section('content')
<div class="body-page-loader d-none">
    <div class="loader">
        <div class="line-scale-pulse-out">
            <div class="bg-warning"></div>
            <div class="bg-warning"></div>
            <div class="bg-warning"></div>
            <div class="bg-warning"></div>
            <div class="bg-warning"></div>
        </div>
    </div>
</div>

<div class="app-main__inner">
    <div class="app-page-title">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i class="pe-7s-notebook icon-gradient bg-mixed-hopes"></i>
                </div>
                <div>Feedback
                    <div class="page-title-subheading">Feedback &gt; Feedback List</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href=""> Home</a></li>
                    <li class="breadcrumb-item active">Feedback</li>
                </ol>
            </div>
        </div>
    </div>
    <div id="successMessageContainer"></div>
    <style>
        .advance-search-panel {
            background-color: #fff;
            box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
            padding: 1rem;
            margin-top: 1rem;
        }
        /* Modern Table & Mobile Card Design */
        .table-borderless { border-collapse: separate; border-spacing: 0; width: 100%; margin-bottom: 0; }
        .table-borderless thead th { background-color: #f8fafc; color: #1e293b; font-size: 0.85rem; font-weight: 700; border-bottom: 1px solid #e2e8f0; border-top: none; padding: 1rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .table-borderless tbody td { vertical-align: middle; border-bottom: 1px solid #e2e8f0 !important; border-top: none; padding: 1.25rem 1rem; color: #475569; }
        .table-borderless tbody tr:hover { background-color: #f8fafc; }
        
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
            .table-borderless thead { display: none; }
            .table-borderless tbody tr { display: flex; flex-direction: column; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.02); overflow: hidden; padding: 0; }
            .table-borderless tbody td { border: none !important; padding: 1rem 1.25rem !important; display: block; width: 100% !important; border-bottom: 1px dashed #e2e8f0 !important; }
            .table-borderless tbody td:last-child { border-bottom: none !important; }
            
            /* Mobile Labels */
            .table-borderless tbody td::before { content: attr(data-label); display: block; font-weight: 700; color: #64748b; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px; }
        }
    </style>
    @if (session('success_msg'))
    <div class="alert alert-{{ session('message_type') }}">
        {{ session('success_msg') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert">
            
        </button>
    </div>
    @endif
    <div class="main-card mb-3 card">
        <div class="card-body">
            <div class="card-header p-0">
                <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Feedback
            </div>

            <div class="table-responsive" id="main_table">
                <table id="myTable" class="mb-0 table table-borderless">
                    <thead>
                        <tr>
                            <th style="width:5%">ID</th>
                            <th style="width:25%">User</th>
                            <th style="width:70%">Feedback</th>
                        </tr>
                    </thead>

                    <tbody>
                        @foreach($data as $item)
                        <tr>
                            <td data-label="ID" class="fw-medium text-muted">#{{$item->id}}</td>
                            <td data-label="User">
                                <div class="fw-bold text-dark">{{$item->name}}</div>
                                <div class="text-muted small mt-1"><i class="bi bi-envelope me-1"></i>{{$item->email}}</div>
                                <div class="text-muted small"><i class="bi bi-telephone me-1"></i>{{$item->phone}}</div>
                            </td>
                            <td data-label="Feedback">
                                <p class="mb-0 text-muted" style="line-height: 1.5;">{{$item->feedback}}</p>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection