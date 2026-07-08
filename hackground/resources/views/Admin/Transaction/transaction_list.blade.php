@extends('Admin.layouts.app')

@section('content')
<div class="app-main__inner">
    <div class="app-page-title">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i class="pe-7s-notebook icon-gradient bg-mixed-hopes"></i>
                </div>
                <div>Transaction <div class="page-title-subheading">Transaction &gt; All Transaction List</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}">
                            Home</a></li>
                    <li class="breadcrumb-item active">Transaction</li>
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
        
        /* Modern Soft Badges */
        .badge-soft { padding: 0.35em 0.8em; border-radius: 50px; font-weight: 600; font-size: 0.75rem; letter-spacing: 0.3px; display: inline-block; margin-bottom: 0; }
        .badge-soft-success { background-color: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
        .badge-soft-danger { background-color: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
            .table-borderless thead { display: none; }
            .table-borderless tbody tr { display: flex; flex-direction: column; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.02); overflow: hidden; padding: 0; }
            .table-borderless tbody td { border: none !important; padding: 1rem 1.25rem !important; display: block; width: 100% !important; border-bottom: 1px dashed #e2e8f0 !important; }
            .table-borderless tbody td:last-child { border-bottom: none !important; }
            
            /* Mobile Labels */
            .table-borderless tbody td::before { content: attr(data-label); display: block; font-weight: 700; color: #64748b; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px; }
            
            /* Status alignment on mobile */
            .table-borderless tbody td[data-label="Status"] { display: flex; justify-content: space-between; align-items: center; }
            .table-borderless tbody td[data-label="Status"]::before { margin-bottom: 0; }
        }
    </style>

    <form action="{{ route('transaction.index') }}" class="form-horizontal" novalidate="">
        <div class="row">
            <div class="col-xl col-md-4 col-sm-6">
                <div class="form-field">
                    <label>Transaction Id</label>
                    <input type="search" class="form-control" name="txn_id" placeholder="Transaction Id" value="{{ request('txn_id') }}">
                </div>
            </div>

            <div class="col-xl col-md-4 col-sm-6">
                <div class="form-field">
                    <label>Payment Date (From)</label>
                    <input type="date" class="form-control" name="payment_datefrom" id="datepicker1" value="{{ request('payment_datefrom') }}" autocomplete="off">
                </div>
            </div>

            <div class="col-xl col-md-4 col-sm-6">
                <div class="form-field">
                    <label>Payment Date (To)</label>
                    <input type="date" class="form-control" name="payment_dateto" id="datepicker2" value="{{ request('payment_dateto') }}" autocomplete="off">
                </div>
            </div>

            <div class="col-xl col-md-4 col-sm-6">
                <div class="form-field">
                    <label>Plan Id</label>
                    <input type="search" class="form-control" name="plan_id" placeholder="Plan Id" value="{{ request('plan_id') }}">
                </div>
            </div>

            <div class="col-xl col-md-4 col-sm-6" hidden="">
                <div class="form-field">
                    <label>User Name</label>
                    <input type="search" class="form-control" name="name" placeholder="User Name" value="{{ request('name') }}">
                </div>
            </div>

            <div class="col-xl col-md-4 col-sm-6">
                <div class="form-field">
                    <label>Paid By</label>
                    <input type="search" class="form-control" name="paid_by" placeholder="Paid By" value="{{ request('paid_by') }}">
                </div>
            </div>

            <div class="col-sm-auto col-12 mb-3">
                <label class="d-none d-sm-block">&nbsp;</label>
                <button type="submit" class="btn btn-primary">Search</button>
            </div>
        </div>
    </form>

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
                <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Transaction <div
                    class="btn-actions-pane-right">
                    <div class="btn-group" id="global_action_btn" style="display:none">
                        <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                            onclick="deleteSelected()" data-original-title="Delete selected"><i
                                class="fa fa-trash"></i></button>
                        <button type="button" class="btn btn-success btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                            onclick="changeStatusAll(1)" data-original-title="Make active"><i
                                class="fa fa-thumbs-up"></i></button>
                        <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                            onclick="changeStatusAll(0)" data-original-title="Make inactive"><i
                                class="fa  fa-thumbs-down"></i></button>
                    </div>
                    &nbsp;
                </div>
            </div>

            <div class="table-responsive" id="main_table">
                @if ($transactions->count() > 0)
                <table id="myTable" class="table table-borderless">
                    <thead>
                        <tr>
                            <th style="width:10%">Transaction ID</th>
                            <th style="width:20%">User Id</th>
                            <th style="width:15%">Plan Id</th>
                            <th style="width:15%">Amount</th>
                            <th style="width:15%">Payment Date</th>
                            <th style="width:15%">Paid By</th>
                            <th style="width:15%">Currency</th>
                            <th style="width:10%">Status</th>
                        </tr>
                    </thead>
                    <tbody id="transaction">
                        @foreach($transactions as $value)
                        <tr>
                            <td data-label="Transaction ID" class="fw-medium text-muted">#{{ $value->platform_txn_id }}</td>
                            <td data-label="User Id" class="fw-bold text-dark">{{ $value->user_id }}</td>
                            <td data-label="Plan Id">{{ $value->plan_id }}</td>
                            <td data-label="Amount" class="fw-bold text-success">{{ $value->paid_amount }}</td>
                            <td data-label="Payment Date" class="text-muted"><i class="bi bi-calendar3 me-1"></i>{{ date('d F Y', strtotime($value->created_at)) }}</td>
                            <td data-label="Paid By">{{ $value->paid_by }}</td>
                            <td data-label="Currency" class="fw-medium">{{ strtoupper($value->currency) }}</td>
                            <td data-label="Status">
                                @if($value->payment_status === 'succeeded')
                                <span class="badge-soft badge-soft-success">Accepted</span>
                                @else
                                <span class="badge-soft badge-soft-danger">Rejected</span>
                                @endif
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>

                <!-- Always show pagination -->

                {!! $transactions->links('vendor.pagination.bootstrap-5') !!}

                @else
                <p class="text-center">No transactions found.</p>
                @endif
            </div>

        </div>
    </div>
</div>
@endsection


@section('modals')

@endsection

@push('custom-js')

@endpush