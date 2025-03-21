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

    <form action="{{ url('allproject/all-project-view') }}" method="get">
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
                @if($user_id)
                <div class="btn-actions-pane-right">
                    <a href="{{ url('project/add_project?uid=' . $user_id) }}">
                        <button type="button" class="btn btn-sm btn-success">Add Project</button>
                    </a>
                </div>
                @endif
            </div>

            <div class="table-responsive" id="main_table">
                <table id='table' class="mb-0 table">
                    <thead>
                        <tr>
                            <th style="width:10%">Photo</th>
                            <th style="width:20%">Project</th>
                            <th style="width:8%">Carpet Area</th>
                            <th style="width:20%">Address</th>
                            <th style="width:15%">Post Date</th>
                            <th style="min-width:5px;" class="text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($project as $proj)
                        <tr>
                            <!-- Displaying Photo -->
                            <td>
                                @if($proj->gallery->count() > 0)
                                <img src="{{ asset('user_upload/project_images/' . $proj->gallery->first()->images->first()->filename) }}" alt="Project Photo" width="50" height="50" />
                                @else
                                <span>No Photo</span>
                                @endif
                            </td>

                            <!-- Displaying Project Name (Assuming `name` exists) -->
                            <td><a href="{{url('project/project_details')}}/{{$proj->id}}">{{ $proj->project_name }}</a></td>

                            <!-- Displaying Carpet Area -->
                            <td>{{ $proj->settings->carpet_area ?? 'N/A' }}</td>

                            <!-- Displaying Address -->
                            <td>{{ $proj->location->address ?? 'N/A' }}</td>

                            <!-- Displaying Post Date (Assuming `created_at` exists) -->
                            <td>{{ $proj->created_at->format('d-m-Y') }}</td>

                            <!-- Displaying Status -->
                            <td>
                                <div class="col-auto  mb-2">

                                    <select name="prop_status" id="prop_status"
                                        data-property-id="{{ $proj->id }}"
                                        class="prop_status form-control form-control-sm">
                                        @foreach ($statusMapping as $key => $value)
                                        <option value="{{ $value }}"
                                            {{ $proj->status == $key ? 'selected' : '' }}>
                                            {{ strtoupper($value) }}
                                        </option>
                                        @endforeach
                                        <option value="delete">DELETE</option>
                                        <option value="edit_view">Edit And View</option>
                                    </select>

                                </div>
                                <div class="col-auto">

                                    <input type="checkbox" class="prop_feature_status"
                                        data-prop-id="{{ $proj->id }}" {{ $proj->is_featured ? 'checked' : '' }}>Make Featured
                                    <input type="checkbox" class="prop_top_status"
                                        data-prop-id="{{ $proj->id }}" {{ $proj->is_top ? 'checked' : '' }}>Make Top
                                

                                </div>

                            </td>
                        </tr>
                        @endforeach
                    </tbody>


                </table>
            </div>
            @if ($project->isNotEmpty())
            <div class="card-footer pagination-rounded clearfix justify-content-center">
                <ul class="pagination small mb-0">
                    @if ($project->currentPage() == $project->lastPage() && $project->currentPage() != 1)
                    <li class="page-item">
                        <a href="{{ $project->appends(['term' => request('term')])->url(1) }}" class="page-link"
                            rel="start">
                            <i class="fa fa-chevron-left"></i> First
                        </a>
                    </li>
                    @endif

                    <li class="page-item {{ $project->currentPage() == 1 ? 'disabled' : '' }}">
                        <a href="{{ $project->appends(['term' => request('term')])->previousPageUrl() }}"
                            class="page-link" rel="prev">
                            <i class="fa fa-chevron-left"></i>
                        </a>
                    </li>

                    @for ($i = max($project->currentPage() - 1, 1); $i <= min($project->currentPage() + 1, $project->lastPage()); $i++)
                        <li class="page-item {{ $project->currentPage() == $i ? 'active' : '' }}">
                            <a href="{{ $project->appends(['term' => request('term')])->url($i) }}"
                                class="page-link">{{ $i }}</a>
                        </li>
                        @endfor

                        <li class="page-item {{ $project->currentPage() == $project->lastPage() ? 'disabled' : '' }}">
                            <a href="{{ $project->appends(['term' => request('term')])->nextPageUrl() }}"
                                class="page-link" rel="next">
                                <i class="fa fa-chevron-right"></i>
                            </a>
                        </li>

                        @if ($project->currentPage() != $project->lastPage())
                        <li class="page-item">
                            <a href="{{ $project->appends(['term' => request('term')])->url($project->lastPage()) }}"
                                class="page-link" rel="end">
                                Last <i class="fa fa-chevron-right"></i>
                            </a>
                        </li>
                        @endif
                </ul>
            </div>
            @endif


        </div>
    </div>
</div>
@endsection




@push('custom-js')
<script>
    $(document).ready(function() {

        $('.prop_top_status').change(function() {



            var id = $(this).data('prop-id');
            var status = this.checked ? 1 : 0;

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            $.ajax({
                type: 'POST',
                url: `{{ url('allproject/top_status') }}`,
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
                url: `{{ url('allproject/feature_status') }}`,
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
            switch (status) {
                case 'delete':
                    var url = `{{ url('allproject/delete') }}`
                    break;
                case 'edit_view':
                    window.location.href = `{{ url('project/edit') }}/${propertyId}`;
                    break;
                default:
                    var url = `{{ url('allproject/statusupdate') }}`
                    break;
            }


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