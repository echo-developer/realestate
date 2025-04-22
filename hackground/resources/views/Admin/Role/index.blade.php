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
                    <div>Role Management <div class="page-title-subheading">Role Management &gt; All Role List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}">
                                Home</a></li>
                        <li class="breadcrumb-item active">Role Management</li>
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
        <div class="main-card mb-3 card">
            
                <div class="card-header d-flex">
                    <h4>Role Management</h4>
                    <div class="btn-actions-pane-right">
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
                        {{-- @if (in_array('MEN0006_Add', $rolePermissions)) --}}
                        <button type="button" class="btn btn-site btn-sm btn-primary" id='addRole'>Add Role </button>
                        {{-- @endif --}}
                    </div>
                </div>
                <div class="card-body">
                <div class="table-responsive" id="main_table">
                    <table id="myTable" class="table">
                        <thead>
                            <tr>
                                <th style="width:32px">ID</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th class="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody id="role">
                            @foreach ($roles as $key => $items)
                                <tr>
                                    <td>{{ $items->id }}</td>
                                    <td>{{ $items->name }}</td>
                                    <td>
                                        <input data-id="{{ $items->id }}" class="Rolestatus d-none" type="checkbox"
                                            data-toggle="toggle" data-on="Active" data-off="Inactive" data-onstyle="success"
                                            data-offstyle="danger" data-size="mini" {{ $items->status ? 'checked' : '' }}>
                                    </td>
                                    <td class="text-right">
                                        {{-- @if (in_array('MEN0006_Edit', $rolePermissions)) --}}
                                        <a href="javascript:void(0)" class="me-2"><i class="bi bi-pencil-fill text-success fa-md RoleEditButton"
                                            roleId="{{ $items->id }}"></i></a>
                                        {{-- @endif --}}
                                        {{-- @if (in_array('MEN0006_Delete', $rolePermissions)) --}}
                                        <a href="javascript:void(0)"><i class="bi bi-trash3-fill text-danger fa-md RoleDeleteButton"
                                            roleId="{{ $items->id }}"></i></a>
                                        {{-- @endif --}}
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


@section('modals')
    <div class="modal fade" id="RoleModal" tabindex="-1" role="dialog" aria-labelledby="RoleAddEditModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="RoleAddEditModalLabel"> </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal">
                        
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Example form -->
                    <form id="RoleformData">
                        @csrf
                        <!-- Hidden input for user ID -->
                        <input type="text" class='d-none' id="roleId" name="id">

                        <div class="form-floating mb-3">
                            
                            <input type="text" class="form-control" id="name" name="name" placeholder="" required>
                            <label for="Name">Name</label>
                            <div class="invalid-feedback" id="name_error"></div>
                            <div id="addRoleErrorContainer"></div>
                            <div id="editRoleErrorContainer"></div>

                        </div>

                        <div class="form-floating mb-3">
                            
                            <input type="text" class="form-control" id="slug" name="slug" placeholder="" required>
                            <label for="Name">Slug</label>
                            <div class="invalid-feedback" id="slug_error"></div>
                            <div id="addRoleErrorContainer"></div>
                            <div id="editRoleErrorContainer"></div>
                        </div>

                        <div class="form-group mb-0">
                            <label class="form-label d-block">Status</label>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="status" value=1 class="form-check-input" id="status_1" checked
                                    required>
                                <label class="form-check-label" for="status_1">Active</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="status" value=0 class="form-check-input" id="status_2">
                                <label class="form-check-label" for="status_2">Inactive</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" id="RoleButton" class="btn btn-primary"></button>
                </div>
            </div>


        </div>
    </div>
@endsection

@push('custom-js')
    <script>
        $(document).ready(function() {

            $('#name').on('keyup', function() {

                var name = $(this).val(); // Get the value of the Name input
                var slug = name.toLowerCase() // Convert to lowercase
                    .replace(/ /g, '-') // Replace spaces with hyphens
                    .replace(/[^\w-]+/g, ''); // Remove all non-word chars
                $('#slug').val(slug); // Set the generated slug in the Slug input field
            });

            $('#addRole').click(function() {

                Add_Edit_Role('Add Role', 'Save')

            });

            $('.RoleEditButton').click(function() {

                var id = $(this).attr('roleId');
                //alert(id);
                Add_Edit_Role('Edit Role', 'Update', id);

            });


            function Add_Edit_Role(title, button, id = '') {

                $('#RoleAddEditModalLabel').text(title);
                $('#RoleButton').text(button);
                $('#RoleformData')[0].reset();
                $('#slug').attr('readonly', false);
                $('.invalid-feedback').empty();
                $('.form-control').removeClass('is-invalid');

                if (id) {

                    $.ajax({

                        url: `{{ url('/showSingleRole') }}/` + id,
                        type: 'GET',
                        _token: '{{ csrf_token() }}',
                        dataType: 'json',
                        success: function(response) {
                            // console.log('Success:', response);
                            $('#roleId').val(response.id);
                            $('#name').val(response.name);
                            $('#slug').val(response.slug).attr('readonly', true);
                            $('input[name=status][value="' + response.status + '"]').prop('checked',
                                true);

                        },
                        error: function(xhr, status, error) {
                            console.error('Error:', xhr.responseText);
                        }

                    });
                }
                $('#RoleModal').modal('show');
            }


            $('#RoleButton').on('click', function(event) {
                event.preventDefault();


                var id = $('#roleId').val();
                var f_data = $('#RoleformData').serialize();
                var url = id ? "{{ url('roleupdate') }}" : "{{ url('addnewRole') }}";


                $('.invalid-feedback').text('').hide();
                $('.form-control').removeClass('is-invalid');

                $.ajax({
                    url: url,
                    type: 'post',
                    data: f_data,
                    dataType: 'json',
                    success: function(response) {
                        console.log(response.msg)
                        window.location.reload(true); // Reload the page
                        $('#RoleModal').modal('hide');
                        $('#RoleformData')[0].reset();
                    },
                    error: function(xhr) {

                        if (xhr.status === 422) {
                            var errors = xhr.responseJSON.errors;
                            console.log(errors);


                            $.each(errors, function(key, value) {
                                var field = $('#' + key);
                                var errorField = $('#' + key +
                                    '_error');
                                field.addClass(
                                    'is-invalid');
                                errorField.text(value[0]).show();
                            });
                        } else {

                            console.log('An error occurred:', xhr.status, xhr.statusText);
                        }
                    }
                });

            });

            $(".Rolestatus").change(function(event) {

                var toastrOptions = {
                    "progressBar": true,
                    "positionClass": "toast-top-right",
                    "showDuration": "300",
                    "hideDuration": "1000",
                    "timeOut": "5000",
                    "extendedTimeOut": "1000",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut",
                };

                toastr.success('Request processed successfully.', 'Role Status Changed', toastrOptions);

                let roleId = $(this).data('id');
                let status = $(this).prop('checked') ? 1 : 0;

                $.ajax({

                    url: "{{ url('/rolestausUp') }}",
                    type: 'POST',
                    data: {
                        _token: '{{ csrf_token() }}',
                        role_id: roleId,
                        status: status
                    },
                    dataType: 'json',
                    success: function(response) {
                        console.log('Status changed successfully:', response);
                    },
                    error: function(xhr, status, error) {
                        console.error('Error updating status:', xhr.responseText);
                    }

                });

            });


            $('.RoleDeleteButton').click(function() {
                if (!confirm('Are you sure you want to delete this Role?')) {
                    return;
                }

                var id = $(this).attr('roleid');
                //alert(id);
                // deleteRole('Edit Role', 'Update', id);


                $.ajax({

                    url: "{{ url('/deleteRole') }}/" + id,
                    type: 'POST',
                    data: {
                        _token: '{{ csrf_token() }}',
                        status: "{{ config('constants.STATUS_DELETE') }}",
                    },
                    dataType: 'json',
                    success: function(response) {
                        // console.log('Success:', response);\
                        window.location.reload(true);


                    },
                    error: function(xhr, status, error) {
                        console.error('Error:', xhr.responseText);
                    }

                });

            });



            var table = $('#myTable').DataTable({
                "paging": false,
                "searching": false,
                "info": false,
                "ordering": true,
                "order": [
                    [0, 'desc']
                ],
                "columnDefs": [{
                        "orderable": false,
                        "targets": [2, 3]
                    },

                ]

            });


        });
    </script>
@endpush
