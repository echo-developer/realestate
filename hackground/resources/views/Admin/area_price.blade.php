@extends('Admin.layouts.app')
{{-- @dd($users ) --}}

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
                <div>Area Price
                    <div class="page-title-subheading">Location &gt; Area Price List</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href=""> Home</a></li>
                    <li class="breadcrumb-item active">Area Price List</li>
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
            <ul class="nav nav-underline mb-3" id="priceTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <a class="nav-link active" id="area-price-tab" data-bs-toggle="tab" href="#area-price" role="tab" aria-controls="area-price" aria-selected="true">
                        Property Area Price
                    </a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class="nav-link" id="project-tab" data-bs-toggle="tab" href="#project" role="tab" aria-controls="project" aria-selected="false">
                        Project Area Price
                    </a>
                </li>
            </ul>

            <div class="tab-content mt-3" id="priceTabContent">
                <!-- Area Price Tab -->
                <div class="tab-pane fade show active" id="area-price" role="tabpanel" aria-labelledby="area-price-tab">
                    <div class="table-responsive" id="main_table">
                        <table id="myTable" class="mb-0 table">
                            <thead>
                                <tr>
                                    <th style="width:15%">ID</th>
                                    <th style="width:25%">Locality</th>
                                    <th style="width:25%">Year</th>
                                    <th style="width:25%">Original Price</th>
                                    <th style="width:15%">New Price</th>
                                    <th style="min-width:30px;" class="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($locality_price_prop as $item)
                                <tr>
                                    <td>{{$item->id}}</td>
                                    <td>{{get_name_by_id('locality_names','locality_id',$item->locality,'en')??'N/A'}}</td>
                                    <td>{{$item->year}}</td>
                                    <td>{{$item->price_per_sqft}}</td>
                                    <td>{{ $item->new_price ?? 'N/A' }}</td>
                                    <td class="text-right">
                                        <i class="fa fa-edit text-success fa-md editButton" data-id="{{$item->id}}"></i>
                                    </td>
                                </tr>
                                @endforeach  
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Project Tab -->
                <div class="tab-pane fade" id="project" role="tabpanel" aria-labelledby="project-tab">
                    <div class="table-responsive" id="main_table">
                        <table id="myTable" class="mb-0 table">
                            <thead>
                                <tr>
                                    <th style="width:15%">ID</th>
                                    <th style="width:25%">Locality</th>
                                    <th style="width:25%">Original Price</th>
                                    <th style="width:15%">New Price</th>
                                    <th style="min-width:30px;" class="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($locality_price_proj as $item)
                                <tr>
                                    <td>{{$item->id}}</td>
                                    <td>{{get_name_by_id('locality_names','locality_id',$item->locality,'en')??'N/A'}}</td>
                                    <td>{{$item->price_per_sqft}}</td>
                                    <td>{{ $item->new_price ?? 'N/A' }}</td>
                                    <td class="text-right">
                                        <i class="fa fa-edit text-success fa-md editButton" data-id="{{$item->id}}"></i>
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>



</div>
@endsection

@section('modals')
<!-- Modal -->
<div class="modal fade" id="Modal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="ModalLabel"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal">

                </button>
            </div>
            <div class="modal-body">
                <form id="Form">
                    @csrf
                    <input type="hidden" name="id" id="id">

                    <div class="mb-3">
                        <label for="locality" class="form-label">Locality</label>
                        <input type="text" class="form-control" id="locality" name="locality" required>
                        <div class="invalid-feedback" id="locality_error"></div>
                    </div>

                    <div class="mb-3">
                        <label for="price_per_sqft" class="form-label">Original Price (per sqft)</label>
                        <input type="number" step="0.01" class="form-control" id="price_per_sqft" name="price_per_sqft" required>
                        <div class="invalid-feedback" id="price_per_sqft_error"></div>
                    </div>

                    <div class="mb-3">
                        <label for="new_price" class="form-label">New Price</label>
                        <input type="number" step="0.01" class="form-control" id="new_price" name="new_price">
                        <div class="invalid-feedback" id="new_price_error"></div>
                    </div>


                </form>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" id="saveButton" class="btn btn-primary">Save</button>
            </div>
        </div>
    </div>
</div>

@endsection
@push('custom-js')
<script>
    $(document).ready(function() {
        $('.editButton').on('click', function() {
            let id = $(this).data('id');
            $.ajax({
                url: "{{ route('locality_price.edit') }}",
                type: "GET",
                data: {
                    id: id,
                    _token: '{{ csrf_token() }}'
                },
                success: function(response) {
                    $('#id').val(response.data.id);
                    $('#locality').val(response.data.locality).prop('readonly', true);
                    $('#price_per_sqft').val(response.data.price_per_sqft).prop('readonly', true);
                    $('#new_price').val(response.data.new_price);

                    $('#ModalLabel').text('Edit');
                    $('#Modal').modal('show');
                },
                error: function(xhr, status, error) {
                    console.error(xhr.responseText);
                }
            });
        });

        $('#saveButton').on('click', function() {
            let formData = $('#Form').serialize();

            $.ajax({
                url: "{{ route('locality_price.update') }}", // Use appropriate route name for saving
                type: "POST",
                data: formData,
                success: function(response) {
                    $('#Modal').modal('hide');
                    $('#Form')[0].reset();
                    $('.invalid-feedback').text('');
                    location.reload();
                },
                error: function(xhr) {

                    $('.invalid-feedback').text('');
                    $('.form-control').removeClass('is-invalid');

                    if (xhr.status === 422) {
                        let errors = xhr.responseJSON.errors;
                        $.each(errors, function(key, value) {
                            $(`#${key}`).addClass('is-invalid');
                            $(`#${key}_error`).text(value[0]);
                        });
                    } else {
                        console.error(xhr.responseText);
                    }
                }
            });
        });

    });
</script>
@endpush