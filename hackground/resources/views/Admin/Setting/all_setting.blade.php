@extends('Admin.layouts.app')

@section('content')
    <div class="app-main__inner">
        <div class="app-page-title">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon">
                        <i class="pe-7s-notebook icon-gradient bg-mixed-hopes"></i>
                    </div>
                    @if (isset($group_key))
                        <div>{{ ucwords(strtolower($group_key)) }} Setting
                            <div class="page-title-subheading">Settings &gt; {{ ucwords(strtolower($group_key)) }}
                                Setting</div>
                        </div>
                    @else
                        <div>Default Setting
                            <div class="page-title-subheading">Settings &gt; Default Setting</div>
                        </div>
                    @endif
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                        <li class="breadcrumb-item active">Settings</li>
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
            /* Settings tab bar with inline search */
            .settings-tab-bar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 1px 4px rgba(0,0,0,0.08);
                padding: 0.5rem 1rem;
                min-height: 80px;
                margin-bottom: 1.25rem;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            .settings-tab-bar .nav {
                border-bottom: none;
                flex-wrap: nowrap;
                gap: 0;
            }
            .settings-tab-bar .nav-link {
                color: #495057;
                font-size: 0.88rem;
                font-weight: 500;
                padding: 0.6rem 1rem;
                border-bottom: 2px solid transparent;
                border-radius: 0;
                white-space: nowrap;
                transition: color .15s, border-color .15s;
            }
            .settings-tab-bar .nav-link:hover {
                color: #1a73e8;
            }
            .settings-tab-bar .nav-link.active {
                color: #1a73e8;
                border-bottom-color: #1a73e8;
                font-weight: 600;
            }
            .settings-search-wrap {
                display: flex;
                align-items: center;
                flex-shrink: 0;
            }
            .settings-search-input-wrap {
                position: relative;
                display: flex;
                align-items: center;
            }
            .settings-search-input-wrap .search-icon {
                position: absolute;
                left: 10px;
                color: #6c757d;
                font-size: 0.9rem;
                pointer-events: none;
            }
            .settings-search-wrap .form-control {
                width: 220px;
                border-radius: 20px 0 0 20px;
                font-size: 0.85rem;
                height: 38px;
                padding-left: 34px;
                border: 1.5px solid #dee2e6;
                border-right: none;
                background: #f8f9fc;
                transition: border-color .2s, box-shadow .2s;
            }
            .settings-search-wrap .form-control:focus {
                border-color: #1a73e8;
                box-shadow: none;
                background: #fff;
                outline: none;
            }
            .settings-search-wrap .btn {
                height: 38px;
                border-radius: 0 20px 20px 0;
                padding: 0 1rem;
                font-size: 0.85rem;
                border: none;
            }
            /* Card header overrides */
            .settings-card-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.85rem 1.25rem;
                background: #fff;
                border-bottom: 1px solid #e0e6ef;
            }
            .settings-card-header h4 {
                font-size: 0.82rem;
                font-weight: 700;
                letter-spacing: 0.07em;
                text-transform: uppercase;
                color: #343a40;
                margin: 0;
            }
            .btn-add-setting {
                background-color: #1a73e8;
                color: #fff;
                border: none;
                border-radius: 6px;
                font-size: 0.85rem;
                font-weight: 500;
                padding: 0.45rem 1rem;
                display: inline-flex;
                align-items: center;
                gap: 0.3rem;
                transition: background .15s;
            }
            .btn-add-setting:hover {
                background-color: #1558c0;
                color: #fff;
            }
            /* Table overrides */
            .settings-table thead th {
                background-color: #f0f4fb;
                color: #495057;
                font-size: 0.82rem;
                font-weight: 700;
                border-top: none;
                border-bottom: 1px solid #dee2e6;
                padding: 0.75rem 1rem;
            }
            .settings-table tbody td {
                font-size: 0.875rem;
                color: #343a40;
                padding: 0.75rem 1rem;
                vertical-align: middle;
                border-color: #f0f0f0;
            }
            .settings-table tbody tr:hover {
                background-color: #f8f9ff;
            }
            /* Action icon buttons */
            .action-icon-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 34px;
                height: 34px;
                border-radius: 6px;
                border: none;
                cursor: pointer;
                font-size: 1rem;
                transition: opacity .15s, transform .15s;
                text-decoration: none;
            }
            .action-icon-btn:hover {
                opacity: 0.85;
                transform: scale(1.08);
            }
            .action-icon-btn.edit {
                background-color: #fff;
                color: #2e7d32;
                border: 1.5px solid #c3c7c3;
            }
            .action-icon-btn.delete {
                background-color: #fff;
                color: #c62828;
                border: 1.5px solid #c3c7c3;
            }
            .actions-cell {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 6px;
            }

            /* ── Mobile Responsive ── */
            @media (max-width: 767px) {
                /* Tab bar: scrollable row */
                .settings-tab-bar {
                    flex-direction: column;
                    align-items: flex-start;
                    min-height: auto;
                    padding: 0.5rem 0.75rem;
                    gap: 0.5rem;
                }
                .settings-tab-bar .nav {
                    width: 100%;
                    overflow-x: auto;
                    flex-wrap: nowrap;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                }
                .settings-tab-bar .nav::-webkit-scrollbar { display: none; }
                .settings-tab-bar .nav-link {
                    padding: 0.5rem 0.75rem;
                    font-size: 0.82rem;
                }
                /* Search full width on mobile */
                .settings-search-wrap {
                    width: 100%;
                }
                .settings-search-input-wrap {
                    flex: 1;
                }
                .settings-search-wrap .form-control {
                    width: 100%;
                }
                /* Card header stack */
                .settings-card-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.6rem;
                    padding: 0.75rem 1rem;
                }
                .btn-add-setting {
                    width: 100%;
                    justify-content: center;
                }
                /* Table: card-style rows */
                .settings-table thead { display: none; }
                .settings-table tbody tr {
                    display: block;
                    border: 1px solid #e0e6ef;
                    border-radius: 8px;
                    margin-bottom: 0.75rem;
                    padding: 0.5rem 0.75rem;
                    background: #fff;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
                }
                .settings-table tbody td {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.4rem 0;
                    border: none;
                    border-bottom: 1px solid #f3f3f3;
                    font-size: 0.82rem;
                }
                .settings-table tbody td:last-child { border-bottom: none; }
                .settings-table tbody td::before {
                    content: attr(data-label);
                    font-weight: 600;
                    color: #6c757d;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    flex-shrink: 0;
                    margin-right: 0.5rem;
                }
                .actions-cell { justify-content: flex-end; }
            }

            @media (max-width: 480px) {
                .settings-tab-bar .nav-link { padding: 0.4rem 0.6rem; font-size: 0.78rem; }
                .action-icon-btn { width: 30px; height: 30px; font-size: 0.9rem; }
            }

            /* ── Mobile Bottom Sheet Modal ── */
            @media (max-width: 767px) {
                #SettingsModal .modal-dialog {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    margin: 0;
                    width: 100%;
                    max-width: 100%;
                    transform: translateY(100%);
                    transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
                }
                #SettingsModal.show .modal-dialog {
                    transform: translateY(0);
                }
                #SettingsModal .modal-content {
                    border-radius: 20px 20px 0 0;
                    border: none;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 -4px 24px rgba(0,0,0,0.15);
                }
                #SettingsModal .modal-content::before {
                    content: '';
                    display: block;
                    width: 40px;
                    height: 4px;
                    background: #dee2e6;
                    border-radius: 2px;
                    margin: 10px auto 0;
                    flex-shrink: 0;
                }
                #SettingsModal .modal-header {
                    border-bottom: 1px solid #f0f0f0;
                    padding: 0.85rem 1.25rem 0.75rem;
                    flex-shrink: 0;
                }
                #SettingsModal .modal-title {
                    font-size: 1rem;
                    font-weight: 600;
                }
                #SettingsModal .modal-body {
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                    padding: 1rem 1.25rem;
                    flex: 1;
                }
                #SettingsModal .modal-footer {
                    border-top: 1px solid #f0f0f0;
                    padding: 0.75rem 1.25rem;
                    flex-shrink: 0;
                    padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
                }
                #SettingsModal .modal-footer .btn {
                    width: 100%;
                    height: 46px;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                }
                #SettingsModal .form-floating .form-control,
                #SettingsModal .form-floating .form-select {
                    height: 52px;
                    font-size: 0.95rem;
                }
            }
        </style>
        @if (session('success_msg'))
            <div class="alert alert-{{ session('message_type') }}">
                {{ session('success_msg') }}
                <button type="button" class="btn-close " data-bs-dismiss="alert">

                </button>
            </div>
        @endif
        <div class="settings-tab-bar">
            <ul class="nav">
                <li class="nav-item">
                    <a class="nav-link {{ Request::is('Settings/default') || Request::is('Settings') ? 'active' : '' }}"
                        href="{{ url('Settings/default') }}">Default</a>
                </li>
                @foreach ($Settings as $setting)
                    @if ($setting->status != config('constants.STATUS_DELETE'))
                        <li class="nav-item">
                            <a class="nav-link {{ Request::is('Settings/' . $setting->group_key) ? 'active' : '' }}"
                                href="{{ url('/Settings/' . $setting->group_key) }}">
                                {{ $setting->group_name }}
                            </a>
                        </li>
                    @endif
                @endforeach
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('set.payment.method') }}">Payment Method</a>
                </li>
            </ul>
            <form action="{{ url('Settings/' . $group_key) }}" method="get" class="settings-search-wrap">
                <div class="settings-search-input-wrap">
                    <i class="bi bi-search search-icon"></i>
                    <input class="form-control" id="prop_category_search" placeholder="Search settings..."
                        name="term" value="{{ request('term') }}" />
                </div>
                <button type="submit" class="btn btn-primary">
                    Search
                </button>
            </form>
        </div>

        <div class="main-card mb-3 card">

            <div class="settings-card-header">
                @if (isset($group_key))
                    <h4>{{ strtoupper($group_key) }} Settings</h4>
                @else
                    <h4>Default Settings</h4>
                @endif
                <button type="button" class="btn-add-setting" id="allSettingsaddButton">
                    <i class="fa fa-plus"></i> Add New Setting
                </button>
            </div>
            <div class="card-body">
                <div class="table-responsive" id="main_table">
                    <table class="mb-0 table settings-table">
                        <thead>
                            <tr>
                                <th>Setting Name</th>
                                <th>Key</th>
                                <th>Value</th>
                                <th class="text-right">Action</th>
                            </tr>
                            <thead>
                            <tbody id="allSettingBody">
                                @forelse ($all_settings as $items)
                                    <tr>
                                        <td data-label="Setting Name">{{ $items->title }}</td>
                                        <td data-label="Key">{{ $items->setting_key }}</td>
                                        <td data-label="Value" style="width:40%;word-break: break-all;">{{ $items->setting_value }}</td>
                                        <td>
                                            <div class="actions-cell">
                                                {{-- Edit --}}
                                                @if ($items->editable != 0)
                                                    <a href="javascript:void(0)" data-bs-toggle="tooltip"
                                                        data-bs-placement="top" data-bs-title="Edit"
                                                        class="action-icon-btn edit allSettingsEditButton" setting-id="{{ $items->id }}">
                                                        <i class="bi bi-pencil-square"></i>
                                                    </a>
                                                @endif
                                                {{-- Delete --}}
                                                @if ($items->deletable != 0)
                                                    <a href="javascript:void(0)" data-bs-toggle="tooltip"
                                                        data-bs-placement="top" data-bs-title="Delete"
                                                        class="action-icon-btn delete allSettingsDeleteButton" setting-id="{{ $items->id }}">
                                                        <i class="bi bi-trash3-fill"></i>
                                                    </a>
                                                @endif
                                            </div>
                                        </td>
                                    @empty
                                    <tr>
                                        <td colspan="6">Sorry, no records found!</td>
                                    </tr>
                                @endforelse

                            </tbody>

                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection


@section('modals')
    <div class="modal fade" id="SettingsModal" tabindex="-1" role="dialog" aria-labelledby="addEditModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="settingsAddEditModalLabel"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal">

                    </button>
                </div>
                <div class="modal-body">
                    <!-- Example form -->
                    <form id="settinngsformData">
                        @csrf
                        <!-- Hidden input for user ID -->
                        <input type="text" class='d-none' id="settingsId" name="settingsId">
                        <input type="text" class='d-none' value="" id="group_key" name="group_key">

                        <div class="form-floating mb-3" id="Groups">

                            <select class="form-select" id="Groups_data" name="Groups" required>
                                <option value="default">Default</option>

                                @foreach ($Settings as $setting)
                                    <option value="{{ strtolower($setting->group_key) }}">
                                        {{ $setting->group_name }}
                                    </option>
                                @endforeach
                            </select>
                            <label for="Groups">Setting Groups</label>

                        </div>
                        <div class="form-floating mb-3">

                            <input type="text" class="form-control" id="setting_name" name="setting_name"
                                placeholder="" required>
                            <label for="setting_name">Setting Name</label>
                            <div class="invalid-feedback" id="setting_name_error"></div>

                        </div>
                        <div class="form-floating mb-3">

                            <input type="text" class="form-control" id="setting_Key" name="setting_Key"
                                placeholder="" required>
                            <label for="setting_Key">Setting Key</label>
                            <div class="invalid-feedback" id="setting_Key_error"></div>
                        </div>

                        <div class="form-floating mb-3">

                            <input type="text" class="form-control" id="setting_Value" name="setting_Value"
                                placeholder="" required>
                            <label for="setting_Value">Setting Value</label>
                            <div class="invalid-feedback" id="setting_Value_error"></div>
                        </div>

                        <div class="form-floating mb-3">

                            <input type="text" class="form-control" id="Display_Order" name="Display_Order"
                                placeholder="" required>
                            <label for="Display_Order">Display Order</label>
                            <div class="invalid-feedback" id="Display_Order_error"></div>
                        </div>

                        <div class="form-group" id="Editable">
                            <label class="form-label d-block">Editable</label>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="Editable" value=1 class="form-check-input" id="Editable_1"
                                    checked required>
                                <label class="form-check-label" for="Editable_1">Yes</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="Editable" value=0 class="form-check-input" id="Editable_2">
                                <label class="form-check-label" for="Editable_2">No</label>
                            </div>
                        </div>

                        <div class="form-group mb-0" id="Deletable">
                            <label class="form-label d-block">Deletable</label>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="Deletable" value=1 class="form-check-input" id="Deletable_1"
                                    checked required>
                                <label class="form-check-label" for="Deletable_1">Yes</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="Deletable" value=0 class="form-check-input"
                                    id="Deletable_2">
                                <label class="form-check-label" for="Deletable_2">No</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" id="SettingsButton" class="btn btn-primary">Save</button>
                </div>
            </div>


        </div>
    </div>
@endsection

@push('custom-js')
    <script>
        $(document).ready(function() {

            $('#setting_name').on('keyup', function() {

                var setting_name = $(this).val(); // Get the value of the Name input
                var setting_key = setting_name.toLowerCase() // Convert to lowercase
                    .replace(/ /g, '-') // Replace spaces with hyphens
                    .replace(/[^\w-]+/g, ''); // Remove all non-word chars
                $('#setting_Key').val(setting_key); // Set the generated slug in the Slug input field
            });


            $('#allSettingsaddButton').click(function() {

                $('#Editable').show();
                $('#Deletable').show();

                Add_Edit_Setting('Add Setting', 'Save')

            });

            $('.allSettingsEditButton').click(function() {

                var settingid = $(this).attr('setting-id');
                //alert(id);
                Add_Edit_Setting('Edit Setting', 'Update', settingid);

            });


            function Add_Edit_Setting(title, button, id = '') {

                $('#settingsAddEditModalLabel').text(title);
                $('#SettingsButton').text(button);
                $('#settinngsformData')[0].reset();
                // $('#slug').attr('readonly', false);
                $('.invalid-feedback').empty();
                $('.form-control').removeClass('is-invalid');

                if (id) {
                    $('#Editable').hide();
                    $('#Deletable').hide();
                    $.ajax({

                        url: `{{ url('/showSettingforEdit') }}/` + id,
                        type: 'GET',
                        _token: '{{ csrf_token() }}',
                        dataType: 'json',
                        success: function(response) {
                            // console.log('Success:', response);
                            $('#settingsId').val(response.id);
                            $('#Groups_data').val(response.setting_group); // Group key for the select
                            $('#setting_name').val(response.title);
                            $('#setting_Key').val(response.setting_key);
                            $('#setting_Value').val(response.setting_value);
                            $('#Display_Order').val(response.display_order);

                            // Set radio button for Editable
                            $('input[name="Editable"][value="' + response.editable + '"]').prop(
                                'checked', true);

                            // Set radio button for Deletable
                            $('input[name="Deletable"][value="' + response.deletable + '"]').prop(
                                'checked', true);


                        },
                        error: function(xhr, status, error) {
                            console.error('Error:', xhr.responseText);
                        }

                    });
                }
                $('#SettingsModal').modal('show');
            }


            $('#SettingsButton').on('click', function(event) {
                event.preventDefault();


                var id = $('#settingsId').val();
                var f_data = $('#settinngsformData').serialize();
                var url = id ? `{{ url('/allSetting-update') }}` : `{{ url('/addnewSetting') }}`;


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
                        $('#settinngsformData')[0].reset();
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


            $('.allSettingsDeleteButton').click(function() {
                if (!confirm('Are you sure you want to delete this Setting?')) {
                    return;
                }

                var id = $(this).attr('setting-id');
                //alert(id);
                // deleteRole('Edit Role', 'Update', id);


                $.ajax({

                    url: `{{ url('/delete-Setting') }}/` + id,
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
