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
                    <div>Admin User
                        <div class="page-title-subheading">Admin User &gt; Admin User List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href=""> Home</a></li>
                        <li class="breadcrumb-item active">Admin User</li>
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
        <div class="main-card mb-3 card">
            <div class="card-body">
                <div class="card-header p-0">
                    <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Menu Permission &nbsp; &nbsp;
                    <span class="badge badge-secondary">Admin</span>
                    <div class="btn-actions-pane-right">
                        <select class="form-control form-control-sm" name="user_role">
                            <option value="">Choose</option>
                            <option value="1" selected="selected">Admin</option>
                            <option value="4">hrhrh</option>
                        </select>
                    </div>
                </div>
                <div class="table-responsive" id="main_table">
                    <form action="" method="post">
                        <input type="hidden" name="admin_role" value="1">
                        <table class="mb-0 table">
                            <thead>
                                <tr>
                                    <th style="width:25%">Menu</th>
                                    <th style="width:25%">Sub Menu</th>
                                    <th style="width:25%">Menu Code</th>
                                    <th class="text-right" style="padding-right:15px;">Give Permission</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        Setting
                                        <div><small>Website Setting</small></div>
                                    </td>
                                    <td>&nbsp;</td>
                                    <td>MEN0001</td>
                                    <td class="text-right">
                                        <span class="check-inline">
                                            <input type="checkbox" class="parent_menu magic-checkbox" name="menu_code[]"
                                                value="MEN0001|1" id="item_1" data-menu-id="1" checked="">
                                            <label for="item_1"></label>
                                        </span>
                                        <a href="javascript:void(0)" onclick="toggleSubMenu('1', this)" class=""
                                            style="display: inline-block; vertical-align: middle;">
                                            <i class="fa fa-chevron-down fa-lg"></i>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="p-3 text-right">
                            <button type="submit" class="btn btn-site mr-2">Save</button>
                            <a href="#side"
                                class="btn btn-secondary">ADD MENU</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
