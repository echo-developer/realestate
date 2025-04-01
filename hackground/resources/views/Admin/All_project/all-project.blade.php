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

        .amenity-container {
            display: flex;
            flex-wrap: wrap;
            /* Allows items to move to the next row */
            gap: 10px;
            /* Adds spacing between items */
        }

        .amenity-item {
            display: flex;
            align-items: center;
            width: 45%;
            /* Adjust for two items per row */
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
                            <th style="width:20%">Address</th>
                            <th style="width:15%">Post Date</th>
                            <th style="width:10%">Leads</th>
                            <th style="width:10%">Action</th>
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

                            <!-- Displaying Address -->
                            <td>{{$proj->additional->project_amenity}}</td>

                            <!-- Displaying Post Date (Assuming `created_at` exists) -->
                            <td>{{ $proj->created_at->format('d-M-Y') }}</td>

                            <td>
                                {{ projectLeadsCount($proj->id) }}
                                <a href="{{ url('/enquiry/project-leads/'.$proj->id) }}" title="View Leads"><i class="fa fa-eye"></i></a>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-warning" onclick="addAmenity(`{{$proj->id}}`)">Add Amenity</button>
                            </td>
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


@section('modals')
<div class="modal fade" id="amenityModal" tabindex="-1" aria-labelledby="amenityModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="amenityModalLabel">Add Amenity Data</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body amenity-container">
                <input type="hidden" name="project_id" id="project_id">


                @foreach($projectAmenities as $projectAmenitie)
                <div class="form-check amenity-item">
                    <input class="form-check-input" type="checkbox"
                        value="{{ $projectAmenitie->id }}">
                    <label class="form-check-label d-flex align-items-center ms-2">
                        <img alt="Parking" height="24" width="24" class="me-2" src="{{ $projectAmenitie->image }}">
                        {{ $projectAmenitie->name }}
                    </label>
                </div>
                @endforeach

            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="saveAmenityBtn">Save</button>
            </div>
        </div>
    </div>
    @endsection
    @push('custom-js')

    <script>
        function getAmenities(project_id) {
            $.ajax({
                url: "{{ route('get.amenities') }}", // Make sure this matches the route defined in web.php
                type: "GET",
                data: {
                    projId: project_id,
                    _token: "{{ csrf_token() }}" // Include CSRF token
                },
                success: function(response) {
                    let selectedAmenities;
                    if (response.project_amenity.project_amenity.startsWith('[')) {
                        selectedAmenities = JSON.parse(response.project_amenity.project_amenity).map(String);
                    } else {
                        selectedAmenities = response.project_amenity.project_amenity.split(',').map(String);
                    }

                    $(".amenity-item .form-check-input").each(function() {
                        let amenityId = $(this).val();
                        if (selectedAmenities.includes(amenityId)) {
                            $(this).prop('checked', true);
                        } else {
                            $(this).prop('checked', false);
                        }
                    });
                },
                error: function(xhr, status, error) {
                    console.error("Error:", error);
                }
            });
        }

        addAmenity = (projecId) => {
            $('#project_id').val(projecId);
            getAmenities(projecId);
            $('#amenityModal').modal('show');
        };

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
    <script>
        $(document).ready(function() {

            $("#saveAmenityBtn").click(function() {
                let project_id = $('#project_id').val();

                let checkedAmenities = [];
                $(".amenity-item .form-check-input:checked").each(function() {
                    checkedAmenities.push($(this).val());
                });

                console.log("Selected Amenities:", checkedAmenities);

                saveAmenities(checkedAmenities, project_id);
            });

            function saveAmenities(amenities, project_id) {
                $.ajax({
                    url: "{{ route('save.amenities') }}",
                    type: "POST",
                    data: {
                        projId: project_id,
                        selectedAmenities: amenities,
                        _token: "{{ csrf_token() }}"
                    },
                    success: function(response) {
                        $('#amenityModal').modal('hide');

                        // Store success message in localStorage (or use sessionStorage)
                        localStorage.setItem('successMessage', 'Amenities updated successfully!');

                        // Reload the page
                        location.reload();
                    },
                    error: function(xhr, status, error) {
                        console.error("Error:", error);
                    }
                });
            }

        });
        $(document).ready(function() {
            const successMessage = localStorage.getItem('successMessage');

            if (successMessage) {
                toastr.success(successMessage, '', toastrOptions);
                localStorage.removeItem('successMessage');
            }
        });
    </script>

    @endpush