@extends('Admin.layouts.app')
@section('content')
    <div class="body-page-loader d-none">
        <div class="loader d-none">
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
                    <div>Setting Group <div class="page-title-subheading">Setting Group Management &gt; All Group List
                        </div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                        <li class="breadcrumb-item active">Setting Group</li>
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
                    
                </button>
            </div>
        @endif
        <div class="main-card mb-3 card ">
            <div class="card-body">
                <div class="card-header p-0">
                    <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i>
                    @if (isset($group_key))
                        {{ $group_key }} Setting
                    @else
                        Setting Group
                    @endif
                    <div class="btn-actions-pane-right">
                        {{-- @if (in_array('MEN0051_LIST_Add', $rolePermissions)) --}}
                        <button type="button" class="btn btn-site btn-sm btn-success" id="groupSettingsaddButton">
                            <i class="fa fa-plus"></i>
                            Add new Setting
                        </button>
                        {{-- @endif --}}

                    </div>
                </div>
                <div class="table-responsive" id="main_table" class='d-none'>
                    <table class="mb-0 table">
                        <thead>
                            <tr>
                                <th style="width:10%">ID</th>
                                <th style="width:60%">Name</th>
                                <th style="width:60%">Key</th>
                                <th style="width:10%">Status</th>
                                <th class="text-right" style="padding-right:30px;">Action</th>
                            </tr>
                        </thead>
                        <tbody id="Settings">
                            @foreach ($group_settings as $group_setting => $items)
                                <tr>
                                    <td>{{ $items->setting_group_id }}</td>

                                    <td>{{ $items->group_name }}</td>

                                    <td>{{ $items->group_key }}</td>

                                    <td>
                                        <input data-id="{{ $items->setting_group_id }}" class="Settingstatus d-none"
                                            type="checkbox" data-toggle="toggle" data-on="Active" data-off="Inactive"
                                            data-onstyle="success" data-offstyle="danger" data-size="mini"
                                            {{ $items->status ? 'checked' : '' }}>
                                    </td>

                                    <td class="text-right">
                                        {{-- @if (in_array('MEN0006_Edit', $rolePermissions)) --}}
                                        <i class="fa fa-edit text-success fa-md SettingEditButton"
                                            settingId="{{ $items->setting_group_id }}"></i>
                                        {{-- @endif --}}
                                        {{-- @if (in_array('MEN0006_Delete', $rolePermissions)) --}}
                                        <i class="fa fa-trash text-danger fa-md SettingDeleteButton"
                                            settingId="{{ $items->setting_group_id }}"></i>
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
    <div class="modal fade show" id="groupSettingsModal" tabindex="-1" role="dialog" aria-labelledby="addEditModalLabel"
        aria-hidden="true">
        <div class="modal-dialog " role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="groupSettingsAddEditModalLabel"></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        
                    </button>
                </div>
                <div class="modal-body ">
                    <!-- Example form -->
                    <form id="groupSettinngsformData">
                        @csrf
                        <!-- Hidden input for user ID -->
                        <input type="text" class='d-none' id="groupId" name="groupId">


                        <div class="form-group">
                            <label for="Name">Group Name</label>
                            <input type="text" class="form-control" id="group_name" name="group_name" required>
                            <div class="invalid-feedback" id="group_name_error"></div>

                        </div>
                        <div class="form-group">
                            <label for="group_Key">Group Key</label>
                            <input type="text" class="form-control" id="group_Key" name="group_Key" required>
                            <div class="invalid-feedback" id="group_Key_error"></div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <div class="radio-inline">
                                <input type="radio" name="status" value=1 class="magic-radio" id="status_1" checked
                                    required>
                                <label for="status_1">Active</label>
                                <input type="radio" name="status" value=0 class="magic-radio" id="status_2">
                                <label for="status_2">Inactive</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" id="groupSettingsButton" class="btn btn-primary">Save</button>
                </div>
            </div>


        </div>
    </div>
@endsection

@push('custom-js')
    <script>
        $(document).ready(function() {

            $('#group_name').on('keyup', function() {

                var grp_name = $(this).val(); // Get the value of the Name input
                var grp_key = grp_name.toLowerCase() // Convert to lowercase
                    .replace(/ /g, '-') // Replace spaces with hyphens
                    .replace(/[^\w-]+/g, ''); // Remove all non-word chars
                $('#group_Key').val(grp_key); // Set the generated slug in the Slug input field
            });


            $('#groupSettingsaddButton').click(function() {

                Add_Edit_group_Setting('Add Group Setting', 'Save')

            });

            $('.SettingEditButton').click(function() {

                var grp_stt_id = $(this).attr('settingId');
                // alert(grp_stt_id)
                Add_Edit_group_Setting('Edit Group Setting', 'Update', grp_stt_id);

            });


            function Add_Edit_group_Setting(title, button, id = '') {

                $('#groupSettingsAddEditModalLabel').text(title);
                $('#groupSettingsButton').text(button);
                $('#groupSettinngsformData')[0].reset();
                $('#group_Key').attr('readonly', false);
                $('.invalid-feedback').empty();
                $('.form-control').removeClass('is-invalid');

                if (id) {

                    $.ajax({

                        url: `{{ url('/showGrpSettingList') }}/` + id,
                        type: 'GET',
                        _token: '{{ csrf_token() }}',
                        dataType: 'json',
                        success: function(response) {
                            // console.log('Success:', response);
                            $('#groupId').val(response.setting_group_id);
                            $('#group_name').val(response.group_name);
                            $('#group_Key').val(response.group_key).attr('readonly', true);
                            $('input[name=status][value="' + response.status + '"]').prop('checked',
                                true);

                        },
                        error: function(xhr, status, error) {
                            console.error('Error:', xhr.responseText);
                        }

                    });
                }
                $('#groupSettingsModal').modal('show');
            }


            $('#groupSettingsButton').on('click', function(event) {
                event.preventDefault();


                var grp_stt_id = $('#groupId').val();
                var f_data = $('#groupSettinngsformData').serialize();
                var url = grp_stt_id ? `{{ url('/update-groupSetting') }}` :
                    `{{ url('/addnew-groupSetting') }}`;


                $('.invalid-feedback').text('').hide();
                $('.form-control').removeClass('is-invalid');

                $.ajax({
                    url: url,
                    type: 'post',
                    data: f_data,
                    dataType: 'json',
                    success: function(response) {
                        // console.log(response)
                        window.location.reload(true); // Reload the page
                        $('#SettingsModal').modal('hide');
                        $('#groupSettinngsformData')[0].reset();
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

            $(".Settingstatus").change(function(event) {

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

                toastr.success('Request processed successfully.', 'Setting Status Changed', toastrOptions);

                let settingId = $(this).data('id');
                let status = $(this).prop('checked') ? 1 : 0;

                $.ajax({

                    url: "{{ url('/setting-StatusUpdate') }}",
                    type: 'POST',
                    data: {
                        _token: '{{ csrf_token() }}',
                        setting_Id: settingId,
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



            $('.SettingDeleteButton').click(function() {
                if (!confirm('Are you sure you want to delete this Setting Group?')) {
                    return;
                }

                var id = $(this).attr('settingId');
                //alert(id);
                // deleteRole('Edit Role', 'Update', id);


                $.ajax({

                    url: `{{ url('/delete-GroupSetting') }}/` + id,
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



        });
    </script>
@endpush
