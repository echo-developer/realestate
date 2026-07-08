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
            .app-main__inner { padding-bottom: 2rem; background-color: #f8fafc; overflow-x: hidden; }
            .card-modern { border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); background-color: #ffffff; width: 100%; max-width: 100%; }
            .settings-card-header { padding: 0.85rem 1.25rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; background: #fff; border-radius: 12px 12px 0 0; }
            .settings-card-header h4 { font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #1e293b; margin: 0; display: flex; align-items: center; gap: 0.5rem; }
            .btn-add-setting { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; font-weight: 600; padding: 0.4rem 0.85rem; border-radius: 8px; font-size: 0.85rem; transition: all 0.2s; }
            .btn-add-setting:hover { background: #2563eb; color: #fff; }
            
            .settings-table { width: 100%; margin: 0; color: #334155; }
            .settings-table th { font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; padding: 1rem 1.25rem; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
            .settings-table td { padding: 1rem 1.25rem; vertical-align: middle; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; font-weight: 500; }
            .settings-table tr:last-child td { border-bottom: none; }
            
            .actions-cell { display: flex; gap: 0.5rem; justify-content: flex-end; }
            .action-icon-btn { width: 34px; height: 34px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; border: 1.5px solid transparent; transition: all 0.2s; font-size: 1rem; color: #64748b; background: transparent; cursor: pointer; text-decoration: none; }
            .action-icon-btn.edit { border-color: #bbf7d0; color: #16a34a; background: #f0fdf4; }
            .action-icon-btn.edit:hover { background: #16a34a; color: #fff; transform: scale(1.05); }
            .action-icon-btn.delete { border-color: #fecaca; color: #dc2626; background: #fef2f2; }
            .action-icon-btn.delete:hover { background: #dc2626; color: #fff; transform: scale(1.05); }

            /* Mobile Responsiveness */
            @media (max-width: 767px) {
                .settings-table thead { display: none; }
                .settings-table, .settings-table tbody, .settings-table tr, .settings-table td { display: block; width: 100%; }
                .settings-table tr { margin-bottom: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.02); background: #fff; }
                .settings-table td { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding: 0.75rem 1rem; text-align: right; }
                .settings-table td:last-child { border-bottom: none; background: #f8fafc; }
                .settings-table td::before { content: attr(data-label); font-weight: 600; color: #64748b; font-size: 0.75rem; text-transform: uppercase; text-align: left; padding-right: 1rem; }
                .actions-cell { justify-content: flex-end; width: auto; }
                
                /* Mobile Bottom-Sheet Modal */
                #groupSettingsModal .modal-dialog { position: fixed; bottom: 0; left: 0; right: 0; margin: 0; width: 100%; max-width: 100%; transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1); }
                #groupSettingsModal.show .modal-dialog { transform: translateY(0); }
                #groupSettingsModal .modal-content { border-radius: 20px 20px 0 0; border: none; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 -4px 24px rgba(0,0,0,0.15); }
                #groupSettingsModal .modal-header { border-bottom: 1px solid #f0f0f0; padding: 0.85rem 1.25rem 0.75rem; }
                #groupSettingsModal .modal-body { overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 1rem 1.25rem; }
                #groupSettingsModal .modal-footer { border-top: 1px solid #f0f0f0; padding: 0.75rem 1.25rem; padding-bottom: calc(0.75rem + env(safe-area-inset-bottom)); }
                #groupSettingsModal .form-floating .form-control { height: 52px; font-size: 0.95rem; }
                #groupSettingsButton { width: 100%; height: 46px; border-radius: 12px; font-weight: 600; }
            }
        </style>
        @if (session('success_msg'))
            <div class="alert alert-{{ session('message_type') }}">
                {{ session('success_msg') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert">
                    
                </button>
            </div>
        @endif
        <div class="main-card mb-3 card card-modern">
                <div class="settings-card-header">
                    <h4>
                    @if (isset($group_key))
                        <i class="fa fa-folder text-primary me-2"></i> {{ $group_key }} Setting
                    @else
                        <i class="fa fa-folder text-primary me-2"></i> Setting Group
                    @endif
                    </h4>
                    <button type="button" class="btn-add-setting" id="groupSettingsaddButton">
                        <i class="fa fa-plus me-1"></i> Add New
                    </button>
                </div>
                <div class="card-body">
                <div class="table-responsive" id="main_table">
                    <table class="settings-table">
                        <thead>
                            <tr>
                                <th style="width:50px">ID</th>
                                <th>Name</th>
                                <th>Key</th>
                                <th>Status</th>
                                <th class="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody id="Settings">
                            @foreach ($group_settings as $group_setting => $items)
                                <tr>
                                    <td data-label="ID">#{{ $items->setting_group_id }}</td>
                                    <td data-label="Name" class="fw-bold">{{ $items->group_name }}</td>
                                    <td data-label="Key"><code class="text-primary bg-light px-2 py-1 rounded" style="font-size:0.8rem;">{{ $items->group_key }}</code></td>
                                    <td data-label="Status">
                                        <input data-id="{{ $items->setting_group_id }}" class="Settingstatus d-none"
                                            type="checkbox" data-toggle="toggle" data-on="Active" data-off="Inactive"
                                            data-onstyle="success" data-offstyle="danger" data-size="mini"
                                            {{ $items->status ? 'checked' : '' }}>
                                    </td>
                                    <td data-label="Action" class="text-right">
                                        <div class="actions-cell">
                                            <a href="javascript:void(0)" class="action-icon-btn edit SettingEditButton" settingId="{{ $items->setting_group_id }}">
                                                <i class="bi bi-pencil-square"></i>
                                            </a>
                                            <a href="javascript:void(0)" class="action-icon-btn delete SettingDeleteButton" settingId="{{ $items->setting_group_id }}">
                                                <i class="bi bi-trash3-fill"></i>
                                            </a>
                                        </div>
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
                <div class="modal-header border-bottom-0">
                    <h5 class="modal-title fw-bold" id="groupSettingsAddEditModalLabel"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="groupSettinngsformData">
                        @csrf
                        <input type="hidden" id="groupId" name="groupId">
                        
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="group_name" name="group_name" placeholder="Group Name" required>
                            <label for="group_name">Group Name</label>
                            <div class="invalid-feedback" id="group_name_error"></div>
                        </div>
                        
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="group_Key" name="group_Key" placeholder="Group Key" required>
                            <label for="group_Key">Group Key</label>
                            <div class="invalid-feedback" id="group_Key_error"></div>
                        </div>

                        <div class="form-group mb-0">
                            <label class="form-label d-block text-muted fw-bold" style="font-size:0.85rem;">Status</label>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="status" value="1" class="form-check-input" id="status_1" checked required>
                                <label class="form-check-label" for="status_1">Active</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="status" value="0" class="form-check-input" id="status_2">
                                <label class="form-check-label" for="status_2">Inactive</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer border-top-0">                    
                    <button type="button" id="groupSettingsButton" class="btn btn-primary px-4 shadow-sm">Save</button>
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
