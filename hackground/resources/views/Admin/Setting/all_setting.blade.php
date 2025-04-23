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
    </style>
    @if (session('success_msg'))
    <div class="alert alert-{{ session('message_type') }}">
        {{ session('success_msg') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert">
            
        </button>
    </div>
    @endif
    <form action="{{ url('Settings/' . $group_key) }}" method="get">
        <section class="content-header mb-2">
            <div class="row justify-content-end">
                <div class="col-xl-4 col-lg-6">
                    <div class="input-group">
                        <input class="form-control" id="prop_category_search" placeholder="Search..." name="term" value="{{ request('term') }}" />
                        <div class="input-group-append">
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </form>

    <ul class="nav nav-underline mb-3 gap-4">
        <li class="nav-item">
            <a class="nav-link ajax-link {{ Request::is('Settings/default') || Request::is('Settings')  ? 'active' : '' }}"
                href="{{ url('Settings/default') }}" data-url="{{ url('/Settings/default') }}">
                <span>Default</span>
            </a>
        </li>
        @foreach ($Settings as $setting)
        @if ($setting->status != config('constants.STATUS_DELETE'))
        <li class="nav-item">
            <a class="nav-link ajax-link {{ Request::is('Settings/' . $setting->group_key) ? 'active' : '' }}"
                href="{{ url('/Settings/' . $setting->group_key) }}"
                data-url="{{ url('/Settings/' . $setting->group_key) }}">
                <span>{{ $setting->group_name }}</span>
            </a>
        </li>
        @endif
        @endforeach
        <li class="nav-item">
            <a class="nav-link ajax-link" href="{{ route('set.payment.method') }}">
                <span>Payment Method</span>
            </a>
        </li>
    </ul>

    <div class="main-card mb-3 card">
        
            <div class="card-header d-flex">
                
                @if (isset($group_key))
                <h4>{{ $group_key }} Setting</h4>
                @else
                <h4>Default Setting</h4>
                @endif
                <div class="btn-actions-pane-right">

                    <div class="btn-group" id="global_action_btn" style="display:none">
                        <button type="button" class="btn btn-default btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                            onclick="deleteSelected()" data-original-title="Delete selected"><i
                                class="fa fa-trash"></i></button>
                        <button type="button" class="btn btn-default btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                            onclick="changeStatusAll(1)" data-original-title="Make active"><i
                                class="fa fa-thumbs-up"></i></button>
                        <button type="button" class="btn btn-default btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                            onclick="changeStatusAll(0)" data-original-title="Make inactive"><i
                                class="fa  fa-thumbs-o-down"></i></button>
                    </div>
                    &nbsp;
                    {{-- @if (in_array('MEN0051_LIST_Add', $rolePermissions)) --}}
                    <button type="button" class="btn btn-site btn-sm btn-primary" id="allSettingsaddButton">
                        <i class="fa fa-plus"></i>
                        Add new Setting
                    </button>
                    {{-- @endif --}}

                </div>
            </div>
            <div class="card-body">
            <div class="table-responsive" id="main_table">
                <table class="mb-0 table">
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
                                <td>{{ $items->title }}</td>
                                <td>{{ $items->setting_key }}</td>
                                <td style="width:40%;word-break: break-all;">{{ $items->setting_value }}
                                </td>
                                <td class="text-right">

                                    {{-- @if (in_array('MEN0051_LIST_Edit', $rolePermissions)) --}}
                                    @if ($items->editable != 0)
                                    <a href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Edit" class="allSettingsEditButton"
                                        setting-id="{{ $items->id }}"><i
                                            class="bi bi-pencil-square text-success fa-md"></i></a>
                                    &nbsp;
                                    @endif
                                    {{-- @endif --}}
                                    {{-- @if (in_array('MEN0051_LIST_Edit', $rolePermissions)) --}}
                                    @if ($items->deletable != 0)
                                    <a href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete" class="allSettingsDeleteButton"
                                        setting-id="{{ $items->id }}"><i
                                            class="bi bi-trash3-fill text-danger fa-md"></i></a>
                                    &nbsp;
                                    @endif
                                    {{-- @endif --}}
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
                        
                        <input type="text" class="form-control" id="setting_name" name="setting_name" placeholder="" required>
                        <label for="setting_name">Setting Name</label>
                        <div class="invalid-feedback" id="setting_name_error"></div>

                    </div>
                    <div class="form-floating mb-3">
                        
                        <input type="text" class="form-control" id="setting_Key" name="setting_Key" placeholder="" required>
                        <label for="setting_Key">Setting Key</label>
                        <div class="invalid-feedback" id="setting_Key_error"></div>
                    </div>

                    <div class="form-floating mb-3">
                        
                        <input type="text" class="form-control" id="setting_Value" name="setting_Value" placeholder="" required>
                        <label for="setting_Value">Setting Value</label>
                        <div class="invalid-feedback" id="setting_Value_error"></div>
                    </div>

                    <div class="form-floating mb-3">
                        
                        <input type="text" class="form-control" id="Display_Order" name="Display_Order" placeholder="" required>
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
                            <input type="radio" name="Deletable" value=0 class="form-check-input" id="Deletable_2">
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