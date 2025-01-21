@extends('Admin.layouts.app')
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
                    <div>Project
                        <div class="page-title-subheading">Project &gt; Project List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href=""> Home</a></li>
                        <li class="breadcrumb-item active">Project List</li>
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
        @if (session('success_msg'))
            <div class="alert alert-{{ session('message_type') }}">
                {{ session('success_msg') }}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        @endif

        <form action="{{ url('') }}" method="get">
            <section class="content-header mb-2">
                <div class="row">
                    <div class="offset-sm-8 col-sm-4">
                        <div class="input-group">
                            <input class="form-control" id="prop_category_search" placeholder="Search..." name="term"
                                value="{{ request('term') }}" />
                            <div class="input-group-append">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fa fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </form>

        <div class="main-card mb-3 card">
            <div class="card-body">
                <div class="card-header p-0">
                    <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Project List

                    {{-- <div class="btn-actions-pane-right">
                        <button type="button" class="btn btn-sm btn-success" onclick="add_prop_category()">Add Project
                            Category</button>
                    </div> --}}

                </div>

                <div class="table-responsive" id="main_table">
                    <table id='table' class="mb-0 table">
                        <thead>
                            <tr>
                                <th style="width:10%">Photo</th>
                                <th style="width:20%">Project</th>
                                <th style="width:8%">Type</th>
                                <th style="width:20%">Address</th>
                                <th style="width:8%">Price</th>
                                <th style="width:15%">Post Date</th>
                                <th style="min-width:5px;" class="text-center">Status</th>
                            </tr>
                        </thead>
               


                    </table>
                </div>


          
            </div>
        </div>
    </div>
@endsection




@push('custom-js')
    <script>
        $(document).ready(function() {

            $('.prop_feature_status').change(function() {



                var id = $(this).data('prop-id');
                var status = this.checked ? 1 : 0;

                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });

                $.ajax({
                    type: 'POST',
                    url: `{{ url('allproperties/feature_status') }}`,
                    data: {
                        'status': status,
                        'id': id
                    },
                    success: function(data) {
                        toastr.success('Request processed successfully.', data.message,
                            toastrOptions);
                    },
                    error: function(msg) {
                        console.log(msg);
                        var errors = msg.responseJSON;
                    }
                });
            });


            $('.prop_status').on('change', function() {
                var propertyId = $(this).data('property-id');
                var status = $(this).val();


                var url = (status === 'delete') ?
                    `{{ url('allproperties/delete') }}` :
                    `{{ url('allproperties/statusupdate') }}`;


                $.ajax({
                    url: url,
                    method: 'POST',
                    data: {
                        _token: '{{ csrf_token() }}',
                        status: status,
                        propertyId: propertyId
                    },
                    success: function(response) {

                        console.log(response);
                        window.location.reload(true);
                    },
                    error: function(xhr, status, error) {

                        console.log(error);
                    }
                });
            });

        });
    </script>
@endpush
