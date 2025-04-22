@extends('Admin.layouts.app')
@push('custom-css')
    <style>
        .payment-methods {
            display: flex;
            flex-wrap: wrap;
        }

        .payment-box {
            border: 2px solid #ccc;
            border-radius: 10px;
            padding: 10px;
            position: relative;
            cursor: pointer;
            transition: all 0.3s;
            width: 120px;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .payment-box img {
            max-width: 80px;
            max-height: 80px;
        }

        .payment-box .checkmark {
            position: absolute;
            top: 5px;
            right: 5px;
            background: purple;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 14px;
            display: none;
            align-items: center;
            justify-content: center;
        }

        .payment-box.selected {
            border-color: purple;
            background-color: #f9f0ff;
        }

        .payment-box.selected .checkmark {
            display: flex;
        }
    </style>
@endpush
@section('content')
    <div class="app-main__inner">
        <div class="app-page-title">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon">
                        <i class="pe-7s-notebook icon-gradient bg-mixed-hopes"></i>
                    </div>
                    {{-- @if (isset($group_key))
                <div>{{ ucwords(strtolower($group_key)) }} Setting
                    <div class="page-title-subheading">Settings &gt; {{ ucwords(strtolower($group_key)) }}
                        Setting</div>
                </div>
                @else --}}
                    <div>Payment Methods
                        <div class="page-title-subheading">Settings &gt; Payment Methods</div>
                    </div>
                    {{-- @endif --}}
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                        <li class="breadcrumb-item active">Payment Methods</li>
                    </ol>
                </div>
            </div>
        </div>
        <div id="successMessageContainer"></div>
        @if (session('success_msg'))
            <div class="alert alert-{{ session('message_type') }}">
                {{ session('success_msg') }}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>
            </div>
        @endif
        <div class="main-card mb-3 card">
            <div class="card-body">
                <div class="card-header d-flex">
                    <h4>Payment Methods</h4>
                </div>
                <form action="{{ route('save.payment.method') }}" method="POST">
                    @csrf
                    <div class="container mt-2">
                        <div class="row">
                            <div class="col-auto d-flex align-items-center mb-2">
                                <label for="" class="fw-bold fs-5 text-muted">Select Your Preferred Payment
                                    Methods :</label>
                            </div>

                            <div class="col">
                                <div class="payment-methods d-flex gap-3">
                                    @if (isset($data))
                                        @foreach ($data as $items)
                                            <div class="payment-box {{ $items->is_active ? 'selected' : '' }}"
                                                data-method="{{ $items?->id }}">
                                                <img src="{{ asset('assets/defaults/payment_methods_images/' . $items?->img) }}"
                                                    alt="{{ $items?->method_name }}">
                                                <span class="checkmark">✔</span>
                                            </div>
                                        @endforeach
                                    @endif
                                    <input type="hidden" name="selected_method" id="selected_method">
                                </div>

                            </div>
                        </div>
                        <div class="row mt-4">
                            <div class="col text-center">
                                <button type="submit" class="btn btn-primary">Save Payment Methods</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
@push('custom-js')
    <script>
        $(document).ready(function() {
            function updateSelectedMethods() {
                let selectedMethods = [];
                $('.payment-box.selected').each(function() {
                    selectedMethods.push($(this).data('method'));
                });
                $('#selected_method').val(JSON.stringify(selectedMethods));
            }

            $('.payment-box').on('click', function() {
                $(this).toggleClass('selected');
                updateSelectedMethods();
            });

            updateSelectedMethods();
        });
    </script>
@endpush
