@extends('Admin.layouts.app')
@php
    // log_anything($data);
@endphp
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
                    <div>Landmarks
                        <div class="page-title-subheading">Landmarks &gt; Landmarks List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                        <li class="breadcrumb-item active">Landmarks List</li>
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
                <button type="button" class="btn-close" data-bs-dismiss="alert">

                </button>
            </div>
        @endif

        {{-- @if ($errors->has('xlsFileLocality'))
            <div class="alert alert-danger mt-2">
                {{ $errors->first('xlsFileLocality') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert">
                    
                </button>
            </div>
        @endif --}}
        {{-- <form action="{{ url('landmark-list') }}" method="get">
            <section class="content-header mb-2">
                <div class="row">
                    <div class="offset-sm-8 col-sm-4">
                        <div class="input-group">
                            <input class="form-control" id="prop_transaction_search" placeholder="Search..." name="term"
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
        </form> --}}
        <div class="main-card mb-3 card">
            <div class="card-body">
                @php
                    $localityName = get_name_by_id('locality_names', 'locality_id', $localityId, 'en');
                @endphp
                <div class="card-header d-flex">
                    <h4>Landmarks List of
                        {{ strToUpper($localityName) }}</h4>

                    {{-- <div class="btn-actions-pane-right">
                        <button type="button" class="btn btn-sm btn-success" onclick="add()">Add More Landmarks</button>
                    </div> --}}

                </div>

                <div class="table-responsive" id="main_table">
                    <table id="myTable" class="mb-0 table">
                        <thead>
                            <tr>
                                <th style="width:35%;">Name</th>
                                <th style="width:20%;">Distance (KM)</th>
                                <th style="width:20%;">Status</th>
                                <th style="width:20%;" class="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @if (isset($data))
                                @foreach ($data as $item)
                                    <tr>
                                        <td>{{ $item->name_en ?? 'N/A' }}</td>
                                        <td>{{ $item->distance_km ?? 'N/A' }}</td>
                                        <td>
                                            <input data-id="{{ $item->id }}" class="status d-none" type="checkbox"
                                                data-toggle="toggle" data-on="Active" data-off="Inactive"
                                                data-onstyle="success" data-offstyle="danger" data-size="mini"
                                                {{ $item->status ? 'checked' : '' }}>
                                        </td>
                                        <td class="text-right">
                                            <i class="fa fa-edit text-success fa-md "
                                                onclick="Edit('{{ $item->id }}')"></i>
                                            <i class="fa fa-trash text-danger fa-md"
                                                onclick="Delete('{{ $item->id }}')"></i>
                                        </td>
                                    </tr>
                                @endforeach
                            @else
                                <tr>
                                    <td colspan="5">Sorry, no records found!</td>
                                </tr>
                            @endif
                        </tbody>
                    </table>
                </div>
                {!! $data->links('vendor.pagination.bootstrap-5') !!}

            </div>
        </div>
    </div>
@endsection
@section('modals')
    <div class="modal fade" id="modal_action" tabindex="-1" role="dialog" aria-labelledby="addEditModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">

                    <h5 class="modal-title" id="AddEditModalLabel"></h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal">

                    </button>
                </div>
                <div class="modal-body">

                    <form id="formData">
                        <input type="text" class='d-none' id="landmarkId" name="landmarkId">
                        @php
                            $langs = explode(',', admin_default_lang());
                        @endphp
                        @foreach ($langs as $lang)
                            <div class="form-group">
                                <label for="name">{{ __('Name') }} ({{ strtoupper($lang) }})</label>
                                <input type="text" class="form-control reset_field" id="name_{{ $lang }}"
                                    name="name[{{ $lang }}]" autocomplete="off">
                                <div class="invalid-feedback" id="name_{{ $lang }}_error"></div>
                            </div>
                        @endforeach

                        <div class="form-group">
                            <label for="distance">Distance</label>
                            <input type="number" class="form-control" id="distance" name="distance" required>
                            <div class="invalid-feedback" id="distance_error"></div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <div class="radio-inline">
                                <input type="radio" name="status" value=1 class="magic-radio" id="status_1">
                                <label for="status_1">Active</label>
                                <input type="radio" name="status" value=0 class="magic-radio" id="status_2">
                                <label for="status_2">Inactive</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" onclick="update()" id="button" class="btn btn-primary">Save</button>
                </div>
            </div>

        </div>
    </div>

    {{-- <div class="modal fade" id="excel_upload_modal" tabindex="-1" role="dialog" aria-labelledby="excel_upload_modal"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">

                    <h5 class="modal-title" id="excel_upload_modal">Upload</h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal">
                        
                    </button>
                </div>
                <div class="modal-body">

                    <form id="excel_upload_form" action="{{ route('locality.importExcel') }}" method="POST"
                        enctype="multipart/form-data">
                        @csrf
                        <input type="file" class="form-control" name="xlsFileLocality">
                        <i class="d-block text-danger mt-2">Allowed file types: xlsx | xls | csv</i>
                        <div class="mt-3 p-3 bg-light border border-danger rounded">
                            <strong class="text-danger d-block mb-2">

                                Note: Download the file format below. Changing or re-ordering the column names can
                                affect your data.
                            </strong>
                            <a href="{{ asset(config('constants.LOCALITY_EXCEL_FORMAT')) }}"
                                class="btn btn-sm btn-outline-primary">Download XLSX Format</a>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" id="button" class="btn btn-primary">Save</button>
                        </div>
                    </form>

                </div>
            </div>

        </div>
    </div> --}}
@endsection
@push('custom-js')
    <script>
        let modalAction = $('#modal_action');
        let modalLabel = $('#AddEditModalLabel');
        let button = $('#button');
        let formData = $('#formData');
        let landmarkId = $('#landmarkId');
        let name_en = $('#name_en');
        let name_ar = $('#name_ar');
        let distance = $('#distance');
        const status = $('.status')

        function AddEdit(title, buttonText, id = null) {
            modalLabel.text(title);
            button.text(buttonText);
            formData[0].reset();
            if (id) {
                $.get(`{{ url('/landmark-edit') }}/${id}`, function(data) {
                    $(`input[name="status"][value="${data.status}"]`).prop('checked', true)
                    name_en.val(data.name_en)
                    name_ar.val(data.name_ar)
                    distance.val(data.distance_km)
                    landmarkId.val(data.id)
                });
            }
            modalAction.modal('show');
        }

        function Edit(id) {
            $('.form-control').removeClass('is-invalid');
            $('.invalid-feedback').empty();
            AddEdit('Edit', 'Update', id);
        }

        function update() {
            let data = formData.serializeArray();
            // let lanmark_id = landmarkId.val()
            let url = `{{ url('/update-landmark') }}`

            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function(response) {
                    // localStorage.setItem('successMessage', response.message);
                    window.location.reload(true);
                    modalAction.modal('hide');
                    formData[0].reset();
                },
                error: function(response) {
                    var errors = response.responseJSON.errors;
                    $('.invalid-feedback').text('').hide();
                    $('.form-control').removeClass('is-invalid');
                    $.each(errors, function(field, messages) {
                        const fieldId = field.replace('.', '_');
                        const inputSelector = `#${fieldId}`;
                        const errorSelector = `#${fieldId}_error`;
                        $(inputSelector).addClass('is-invalid');
                        $(errorSelector).text(messages[0]).show();
                    });
                }
            });
        }


        function Delete(id) {
            if (confirm('Are you sure you want to delete this?')) {
                $.ajax({
                    type: 'POST',
                    url: `{{ url('/landmark-delete') }}/${id}`,
                    success: function(response) {
                        window.location.reload(true);
                    },
                    error: function(response) {
                        var errors = response.responseJSON.errors;
                        console.log(errors)
                    }
                });
            }
        }

        // var table = $('#myTable').DataTable({
        //     "paging": false,
        //     "searching": false,
        //     "info": false,
        //     "ordering": true,
        //     "order": [
        //         [0, 'desc']
        //     ],
        //     "columnDefs": [{
        //             "orderable": true,
        //             "targets": [0]
        //         },
        //         {
        //             "orderable": false,
        //             "targets": [1,2,3]
        //         }
        //     ]
        // });


        $(document).ready(function() {

            status.change(function() {
                var id = $(this).data('id');
                var status = this.checked ? 1 : 0;
                $.ajax({
                    type: 'POST',
                    url: `{{ url('/landmark-status') }}`,
                    data: {
                        _token: '{{ csrf_token() }}',
                        status: status,
                        id: id
                    },
                    success: function(response) {
                        toastr.success('Request Processed Successfully', response.message,
                            toastrOptions);

                    },
                    error: function(msg) {
                        console.log(msg);
                    }
                });

            });



        })
    </script>
@endpush
