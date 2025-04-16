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
                <div>Property Length
                    <div class="page-title-subheading">Property Setting &gt; Property Length List</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                    <li class="breadcrumb-item active">Property Length List</li>
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

    {{-- <form action="{{ url('property/length') }}" method="get">
        <section class="content-header mb-2">
            <div class="row">
                <div class="offset-sm-8 col-sm-4">
                    <div class="input-group">
                        <input class="form-control" id="prop_length_search" placeholder="Search..." name="term" value="{{ request('term') }}" />
                        <div class="input-group-append">
                            <button type="submit" class="btn btn-primary">
                                <i class="fa fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </form> --}}

    <div class="main-card mb-3 card">
        <div class="card-body">
            <form action="{{ url('/property/add-property-length') }}" method="post" enctype="multipart/form-data">
                @csrf
                <div class="row">
                    <div class="col-md-6">
                        <h4 class="mb-3">Room Size</h4>
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label for="room_min">Min</label>
                                <input type="number" min="1" step="1" class="form-control" name="room_min" id="room_min" placeholder="Enter Min Size" required="" value="{{ isset($data[0]) ? $data[0]->value : '' }}">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="room_max">Max</label>
                                <input type="number" min="1" step="1" class="form-control" name="room_max" id="room_max" placeholder="Enter Max Size" required="" value="{{ isset($data[1]) ? $data[1]->value : '' }}">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h4 class="mb-3">Bedroom Size</h4>
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label for="bedroom_min">Min</label>
                                <input type="number" min="1" step="1" class="form-control" name="bedroom_min" id="bedroom_min" placeholder="Enter Min Size" required="" value="{{ isset($data[2]) ? $data[2]->value : '' }}">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="bedroom_max">Max</label>
                                <input type="number" min="1" step="1" class="form-control" name="bedroom_max" id="bedroom_max" placeholder="Enter Max Size" required="" value="{{ isset($data[3]) ? $data[3]->value : '' }}">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <h4 class="mb-3">Bathroom Size</h4>
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label for="bathroom_min">Min</label>
                                <input type="number" min="1" step="1" class="form-control" name="bathroom_min" id="bathroom_min" placeholder="Enter Min Size" required="" value="{{ isset($data[4]) ? $data[4]->value : '' }}">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="bathroom_max">Max</label>
                                <input type="number" min="1" step="1" class="form-control" name="bathroom_max" id="bathroom_max" placeholder="Enter Max Size" required="" value="{{ isset($data[5]) ? $data[5]->value : '' }}">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h4 class="mb-3">Floor Size</h4>
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label for="floor_min">Min</label>
                                <input type="number" min="1" step="1" class="form-control" name="floor_min" id="floor_min" placeholder="Enter Min Size" required="" value="{{ isset($data[6]) ? $data[6]->value : '' }}">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="floor_max">Max</label>
                                <input type="number" min="1" step="1" class="form-control" name="floor_max" id="floor_max" placeholder="Enter Max Size" required="" value="{{ isset($data[7]) ? $data[7]->value : '' }}">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <h4 class="mb-3">Kitchen Size</h4>
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label for="kitchen_min">Min</label>
                                <input type="number" min="1" step="1" class="form-control" name="kitchen_min" id="kitchen_min" placeholder="Enter Min Size" required="" value="{{ isset($data[8]) ? $data[8]->value : '' }}">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="kitchen_max">Max</label>
                                <input type="number" min="1" step="1" class="form-control" name="kitchen_max" id="kitchen_max" placeholder="Enter Max Size" required="" value="{{ isset($data[9]) ? $data[9]->value : '' }}">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h4 class="mb-3">Garage Size</h4>
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label for="garage_min">Min</label>
                                <input type="number" min="1" step="1" class="form-control" name="garage_min" id="garage_min" placeholder="Enter Min Size" required="" value="{{ isset($data[10]) ? $data[10]->value : '' }}">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="garage_max">Max</label>
                                <input type="number" min="1" step="1" class="form-control" name="garage_max" id="garage_max" placeholder="Enter Max Size" required="" value="{{ isset($data[11]) ? $data[11]->value : '' }}">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card-footer">
                    <button type="submit" class="btn btn-primary">Submit</button>&nbsp;
                    <a href="" class="btn">Cancel</a>
                </div>
            </form>

        </div>
    </div>
</div>
@endsection

