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
                    <div>Property
                        <div class="page-title-subheading">Property &gt; Property Category List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href=""> Home</a></li>
                        <li class="breadcrumb-item active">Property Category List</li>
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

        <form action="/prop_category_search" method="get">

            <section class="content-header mb-2">
                <div class="row">
                    <div class="offset-sm-8 col-sm-4">
                        <div class="input-group">
                            <input class="form-control" id="prop_category_search" placeholder="Search..." name="term" value="{{request('term')}}">
                            <div class="input-group-append">
                                <button type="submit" class="btn btn-site btn-primary"><i class="fa fa-search"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </form>

        <div class="main-card mb-3 card">
            <div class="card-body">
                <div class="card-header p-0">
                    <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Property Category List

                    <div class="btn-actions-pane-right">
                        <button type="button" class="btn btn-sm btn-success" onclick="add_prop_category()">Add Property Category</button>
                    </div>

                </div>

                <div class="table-responsive" id="main_table">
                    <table class="mb-0 table">
                        <thead>
                            <tr>
                                <th style="width:5%">ID</th>
                                <th style="width:15%">Name</th>
                                <th style="width:20%">Order</th>
                                <th style="width:10%">Status</th>
                                <th style="min-width:80px;" class="text-right">Action</th>
                            </tr>
                        </thead>

                        @foreach($data as $item)
                        <tbody id="user">
                            <tr>
                                <td>{{$item->id}}</td>
                                <td>{{$item->name}}</td>
                                <td>{{$item->order}}</td>
                                <td>
                                    <input data-id="{{$item->id}}" class="category_prop_status d-none" type="checkbox" data-toggle="toggle" data-on="Active" data-off="Inactive" data-onstyle="success" data-offstyle="danger" data-size="mini" {{$item->status ? 'checked' : '' }}>
                                </td>
                                <td class="text-right">

                                    <i class="fa fa-edit text-success fa-md " onclick="Edit_prop_category('{{ $item->id }}')"></i>

                                    <i class="fa fa-trash text-danger fa-md" onclick="Delete_prop_category('{{ $item->id }}')"></i>

                                </td>
                            </tr>

                        </tbody>
                        @endforeach

                    </table>
                </div>
                <div class="card-footer pagination-rounded clearfix justify-content-center">
                    <ul class="pagination small mb-0">
                        @if ($data->currentPage() == $data->lastPage() & $data->currentPage() != 1)
                        <li class="page-item">
                            <a href="{{ $data->url(1) }}" class="page-link" rel="start">
                                <i class="fa fa-chevron-left"></i> First
                            </a>
                        </li>
                        @endif

                        <li class="page-item {{ $data->currentPage() == 1 ? 'disabled' : '' }}">
                            <a href="{{ $data->previousPageUrl() }}" class="page-link" rel="prev">
                                <i class="fa fa-chevron-left"></i>
                            </a>
                        </li>

                        @for ($i = max($data->currentPage() - 1, 1); $i <= min($data->currentPage() + 1, $data->lastPage()); $i++)
                            <li class="page-item {{ ($data->currentPage() == $i) ? 'active' : '' }}">
                                <a href="{{ $data->url($i) }}" class="page-link">{{ $i }}</a>
                            </li>
                            @endfor

                            <li class="page-item {{ $data->currentPage() == $data->lastPage() ? 'disabled' : '' }}">
                                <a href="{{ $data->nextPageUrl() }}" class="page-link" rel="next">
                                    <i class="fa fa-chevron-right"></i>
                                </a>
                            </li>

                            @if ($data->currentPage()!=$data->lastPage() )
                            <li class="page-item">
                                <a href="{{ $data->url($data->lastPage()) }}" class="page-link" rel="end">
                                    Last <i class="fa fa-chevron-right"></i>
                                </a>
                            </li>
                            @endif
                    </ul>

                </div>
            </div>
        </div>
    </div>


    <div class="modal fade" id="prop_category" tabindex="-1" role="dialog" aria-labelledby="prop_categoryaddEditModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">

                    <h5 class="modal-title" id="prop_categoryAddEditModalLabel"></h5>

                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">

                    <form id="prop_categoryformData">
                        <input type="hidden" class='d-none' id="prop_categoryimage" name="image">
                        <input type="text" class='d-none' id="prop_categoryId" name="id">
                        <div class="form-group">
                            <label for="name_en">Name(en)*</label>
                            <input type="text" class="form-control" id="name_en" name="name_en" required>
                            <div class="invalid-feedback" id="name_en_error"></div>
                        </div>
                        <div class="form-group">
                            <label for="name_ar">Name(ar)*</label>
                            <input type="text" class="form-control" id="name_ar" name="name_ar" required>
                            <div class="invalid-feedback" id="name_ar_error"></div>

                        </div>

                        <div class="form-group">
                            <label for="ufile">Image Icon</label>
                            <div class="input-group">
                                <div class="custom-file">
                                    <input type="file" name="Categoryfile" id="CategoryfileUpload" class="custom-file-input" onchange="updateCategoryFileName()">
                                    <label class="custom-file-label" for="ufile">Choose file</label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <img id="image_preview" src=" " />
                        </div>
                        <div class="form-group">
                            <label for="Order">Order</label>
                            <input type="Order" class="form-control" id="Order" name="Order" required>
                            <div class="invalid-feedback" id="Order_error"></div>
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
                    <button type="button" onclick="add_edit_prop_category()" id="prop_recoButton" class="btn btn-primary">Save</button>
                </div>
            </div>


        </div>
    </div>

 @endsection