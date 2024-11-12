@extends('Admin.layouts.app')

@section('title', 'New Admin | Admin')

@section('content')
    
<div class="app-main__outer">
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
						<li class="breadcrumb-item"><a href="https://scriptlisting.com/selfgood-live/hackground/"> Home</a></li>
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
		<div class="main-card mb-3 card">
			<div class="card-body">
				<div class="card-header p-0">
					<i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Role Management <div class="btn-actions-pane-right">
						<div class="btn-group" id="global_action_btn" style="display:none">
							<button type="button" class="btn btn-danger btn-sm" data-toggle="tooltip" title="" onclick="deleteSelected()" data-original-title="Delete selected"><i class="fa fa-trash"></i></button>
							<button type="button" class="btn btn-success btn-sm" data-toggle="tooltip" title="" onclick="changeStatusAll(1)" data-original-title="Make active"><i class="fa fa-thumbs-up"></i></button>
							<button type="button" class="btn btn-danger btn-sm" data-toggle="tooltip" title="" onclick="changeStatusAll(0)" data-original-title="Make inactive"><i class="fa  fa-thumbs-down"></i></button>
						</div>
						&nbsp;
						{{-- @if (in_array('MEN0006_Add', $rolePermissions)) --}}
						<button type="button" class="btn btn-site btn-sm btn-primary" id='addRole'> <i class="fa fa-plus"></i> Add Role </button>
				        {{-- @endif --}}
					</div>
				</div>

				<div class="table-responsive" id="main_table">
					<table class="mb-0 table">
						<thead>
							<tr>
								<th style="width:10%">ID</th>
								<th style="width:60%">Name</th>
								<th style="width:10%">Status</th>
								<th class="text-right">Action</th>
							</tr>
						</thead>
                        {{-- @if ($roles)
                        <tbody id="role">
							@foreach ($roles as $role)
							<tr>
								<td>{{ $role->id }}</td>
								<td>{{ $role->name }}</td>
								<td>
									<input data-id="{{ $role->id }}" class="Rolestatus d-none" type="checkbox" data-toggle="toggle" data-on="Active" data-off="Inactive" data-onstyle="success" data-offstyle="danger" data-size="mini" {{ $role->status ? 'checked' : '' }}>
								</td>
								<td class="text-right">
								@if (in_array('MEN0006_Edit', $rolePermissions))
									<i class="fa fa-edit text-success fa-md RoleEditButton" roleId="{{ $role->id }}"></i>
									@endif
									@if (in_array('MEN0006_Delete', $rolePermissions))
									<i class="fa fa-trash text-danger fa-md RoleDeleteButton" roleId="{{ $role->id }}"></i>
								@endif
								</td>
							</tr>
							@endforeach
						</tbody> --}}
                            
                        {{-- @endif --}}
					</table>
				</div>
			</div>
		</div>
	</div>


	<div class="modal fade" id="RoleModal" tabindex="-1" role="dialog" aria-labelledby="RoleAddEditModalLabel" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="RoleAddEditModalLabel"> </h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<!-- Example form -->
					<form id="RoleformData">
						@csrf
						<!-- Hidden input for user ID -->
						<input type="hidden"  id="roleId" name="id">

						<div class="form-group">
							<label for="Name">Name</label>
							<input type="text" class="form-control" id="name" name="name" required>
							<div class="invalid-feedback" id="name_error"></div>
							<div id="addRoleErrorContainer"></div>
							<div id="editRoleErrorContainer"></div>

						</div>


						<div class="form-group">
							<label class="form-label">Status</label>
							<div class="radio-inline">
								<input type="radio" name="status" value=1 class="magic-radio" id="status_1" checked required>
								<label for="status_1">Active</label>
								<input type="radio" name="status" value=0 class="magic-radio" id="status_2">
								<label for="status_2">Inactive</label>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
					<button type="button" id="RoleButton" class="btn btn-primary">Save</button>
				</div>
			</div>


		</div>
	</div>
@endsection