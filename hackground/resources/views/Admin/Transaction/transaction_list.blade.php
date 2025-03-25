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
                    <li class="breadcrumb-item"><a href="https://scriptlisting.com/selfgood-live/hackground/">
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
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    @endif
    <div class="main-card mb-3 card">
        <div class="card-body">
            <div class="card-header p-0">
                <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Transaction  <div
                    class="btn-actions-pane-right">
                    <div class="btn-group" id="global_action_btn" style="display:none">
                        <button type="button" class="btn btn-danger btn-sm" data-toggle="tooltip" title=""
                            onclick="deleteSelected()" data-original-title="Delete selected"><i
                                class="fa fa-trash"></i></button>
                        <button type="button" class="btn btn-success btn-sm" data-toggle="tooltip" title=""
                            onclick="changeStatusAll(1)" data-original-title="Make active"><i
                                class="fa fa-thumbs-up"></i></button>
                        <button type="button" class="btn btn-danger btn-sm" data-toggle="tooltip" title=""
                            onclick="changeStatusAll(0)" data-original-title="Make inactive"><i
                                class="fa  fa-thumbs-down"></i></button>
                    </div>
                    &nbsp;
                </div>
            </div>

            <div class="table-responsive" id="main_table">
                @if ($transactions->count() > 0) 
                <table id="myTable" class="table">
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
                            <td>{{ $value->platform_txn_id }}</td>
                            <td>{{ $value->user_id }}</td>
                            <td>{{ $value->plan_id }}</td>
                            <td>{{ $value->paid_amount }}</td>
                            <td>{{ date('d F Y', strtotime($value->created_at)) }}</td>
                            <td>{{ $value->paid_by }}</td>
                            <td>{{ strtoupper($value->currency) }}</td>
                            <td>
                                @if($value->payment_status === 'succeeded')
                                <button type="button" class="btn btn-sm btn-success disabled">Accepted</button>
                                @else
                                <button type="button" class="btn btn-sm btn-danger disabled">Rejected</button>
                                @endif
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>

                <!-- Always show pagination -->
                <div class="d-flex justify-content-center">
                    {!! $transactions->links('vendor.pagination.bootstrap-5') !!}
                </div>

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