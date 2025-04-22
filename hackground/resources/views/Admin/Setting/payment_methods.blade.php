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
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            
        </button>
    </div>
    @endif
    <form action="{{ url('Settings/' . $group_key) }}" method="get">
        <section class="content-header mb-2">
            <div class="row">
                <div class="offset-sm-8 col-sm-4">
                    <div class="input-group">
                        <input class="form-control" id="prop_category_search" placeholder="Search..." name="term" value="{{ request('term') }}" />
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

    <ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav ml-0">
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
            <a class="nav-link ajax-link {{ Request::is('Settings/default') || Request::is('Settings')  ? 'active' : '' }}"
                href="{{ url('Settings/default') }}" data-url="{{ url('/Settings/default') }}">
                <span>Default</span>
            </a>
        </li>
    </ul>

    <div class="main-card mb-3 card">
        <div class="card-body">
            <div class="card-header p-0">
                <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i>
                @if (isset($group_key))
                {{ $group_key }} Setting
                @else
                Default Setting
                @endif
                <div class="btn-actions-pane-right">

                    <div class="btn-group" id="global_action_btn" style="display:none">
                        <button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" title=""
                            onclick="deleteSelected()" data-original-title="Delete selected"><i
                                class="fa fa-trash"></i></button>
                        <button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" title=""
                            onclick="changeStatusAll(1)" data-original-title="Make active"><i
                                class="fa fa-thumbs-up"></i></button>
                        <button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" title=""
                            onclick="changeStatusAll(0)" data-original-title="Make inactive"><i
                                class="fa  fa-thumbs-o-down"></i></button>
                    </div>
                    &nbsp;
                    {{-- @if (in_array('MEN0051_LIST_Add', $rolePermissions)) --}}
                    <button type="button" class="btn btn-site btn-sm btn-success" id="allSettingsaddButton">
                        <i class="fa fa-plus"></i>
                        Add new Setting
                    </button>
                    {{-- @endif --}}

                </div>
            </div>

            <div class="table-responsive" id="main_table">
                <table class="mb-0 table">
                    <thead>
                        <tr>
                            <th style="width:20%">Setting Name</th>
                            <th style="width:30%">Key</th>
                            <th style="width:40%">Value</th>
                            <th class="text-right" style="padding-right:15px;">Action</th>
                        </tr>
                        <thead>
                        <tbody id="allSettingBody">
                            @forelse ($all_settings as $items)
                            <tr>
                                <td>{{ $items->title }}</td>
                                <td>{{ $items->setting_key }}</td>
                                <td style="width:40%;word-break: break-all;">{{ $items->setting_value }}
                                </td>
                                <td class="text-right" style="padding-right:15px;">

                                    {{-- @if (in_array('MEN0051_LIST_Edit', $rolePermissions)) --}}
                                    @if ($items->editable != 0)
                                    <a data-toggle="tooltip" title="" class="allSettingsEditButton"
                                        data-placement="top" data-original-title="Edit"
                                        setting-id="{{ $items->id }}"><i
                                            class="fa fa-edit text-success fa-md"></i></a>
                                    &nbsp;
                                    @endif
                                    {{-- @endif --}}
                                    {{-- @if (in_array('MEN0051_LIST_Edit', $rolePermissions)) --}}
                                    @if ($items->deletable != 0)
                                    <a data-toggle="tooltip" title="" class="allSettingsDeleteButton"
                                        data-placement="top" data-original-title="De"
                                        setting-id="{{ $items->id }}"><i
                                            class="fa fa-trash text-danger fa-md"></i></a>
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