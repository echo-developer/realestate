<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Language" content="en">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="icon" href="{{ asset('../../assets/images/favicon.png') }}" type="image/png">
    <link rel="shortcut icon" href="{{ asset('../../favicon.ico') }}" type="image/x-icon">
    <title>Admin Control | RealEstate Marketplace</title>
    <meta name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- Disable tap highlight on IE -->
    <meta name="msapplication-tap-highlight" content="no">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.9.3/min/dropzone.min.css" type="text/css"
        rel="stylesheet">
    <link href="{{ asset('assets/css/base.min.css') }}" type="text/css" rel="stylesheet">
    <link href="{{ asset('assets/css/icons.css') }}" type="text/css" rel="stylesheet">
    <link href="{{ asset('assets/css/google-material-icons.css') }}" type="text/css" rel="stylesheet">
    <link href="{{ asset('assets/css/mmenu.css') }}" type="text/css" rel="stylesheet">

    <link href="{{ asset('assets/css/style.css') }}" type="text/css" rel="stylesheet">
    <link href="{{ asset('assets/css/custom.css') }}" type="text/css" rel="stylesheet">
    <link href="{{ asset('assets/css/responsive.css') }}" type="text/css" rel="stylesheet">
    <link href="{{ asset('assets/css/ltr.css') }}" type="text/css" rel="stylesheet">
    <link href="{{ asset('assets/css/profile-dropdown.css') }}" type="text/css" rel="stylesheet">
    
    <!-- <link rel="stylesheet" href="{{ asset('assets/js/scripts-init/select2/dist/css/select2.min.css') }}"> -->
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"
        integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        /* Global Premium Alert Styling */
        .app-main__inner > .alert, .alert {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.25rem;
            border-radius: 12px;
            border: none;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
            margin-bottom: 1.5rem;
            position: relative;
            overflow: hidden;
            animation: slideInDown 0.3s ease-out forwards;
        }
        @keyframes slideInDown {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .alert-success {
            background: linear-gradient(to right, #dcfce7, #f0fdf4);
            color: #166534;
            border-left: 5px solid #22c55e;
        }
        .alert-danger {
            background: linear-gradient(to right, #fee2e2, #fef2f2);
            color: #991b1b;
            border-left: 5px solid #ef4444;
        }
        .alert-warning {
            background: linear-gradient(to right, #fef9c3, #fefce8);
            color: #854d0e;
            border-left: 5px solid #eab308;
        }
        .alert .btn-close {
            background: transparent !important;
            border: none;
            font-size: 1.5rem;
            font-weight: 700;
            color: currentColor;
            opacity: 0.5;
            cursor: pointer;
            padding: 0 0.5rem;
            margin: 0;
            line-height: 1;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .alert .btn-close:hover {
            opacity: 1;
            transform: scale(1.1);
        }
        /* Fallback if Bootstrap's SVG is broken */
        .alert .btn-close::after {
            content: "\00d7";
            display: block;
        }
    </style>
    @stack('custom-css')
</head>


<body>
    <div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">
        @include('Admin.layouts.header')

        <div class="app-main">
            @include('Admin.layouts.sidebar')
            <div class="app-main__outer">
                @yield('content')

                <div class="app-wrapper-footer">
                    @include('Admin.layouts.footer')
                </div>
            </div>
        </div>
    </div>
    <!--SCRIPTS INCLUDES-->

    <!--CORE-->

    <!-- <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.bundle.min.js" crossorigin="anonymous">
    </script> -->
    <script src="https://cdn.jsdelivr.net/npm/metismenu"></script>
    <script src="{{ asset('assets/js/scripts-init/app.js') }}"></script>
    <script src="{{ asset('assets/js/scripts-init/demo.js') }}"></script>


    <!--Toggle Switch -->
    <script src="{{ asset('assets/js/vendors/form-components/toggle-switch.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous">
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.min.js"
        integrity="sha384-VQqxDN0EQCkWoxt/0vsQvZswzTHUVOImccYmSyhJTp7kGtPed0Qcx8rK9h9YEgx+" crossorigin="anonymous">
    </script>
    <script>
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    </script>
    <!--Perfect Scrollbar -->
    <script src="{{ asset('assets/js/vendors/scrollbar.js') }}"></script>
    <script src="{{ asset('assets/js/scripts-init/scrollbar.js') }}"></script>
    <!-- <script src="{{ asset('assets/plugins/select2/js/select2.min.js') }}"></script> -->
    <!--Toastr-->
    <script src="{{ asset('assets/dist/js/toastr.min.js') }}"></script>

    {{-- WUSIWYG (CkEditor) --}}
    <script src="https://cdn.ckeditor.com/4.20.2/standard/ckeditor.js" integrity="sha384-<hash>" crossorigin="anonymous">
    </script>

    {{-- XLSX export --}}
    <script src="{{ asset('assets/js/jspdf.js') }}"></script>


    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.12.1/js/jquery.dataTables.min.js">
    </script>
    <!--SweetAlert2-->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <script src="{{ asset('assets/js/scripts-init/sweet-alerts.js') }}"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.9.3/min/dropzone.min.js"></script>
    <!-- <script src="{{ asset('assets/js/scripts-init/select2/dist/js/select2.full.min.js') }}"></script> -->

    @yield('modals')
    <script>
        function c_alert(message, type = 'success') {
            Swal.fire({
                icon: type,
                title: message,
                timer: 3000,
                showConfirmButton: false
            });
        }
    </script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const successMessage = localStorage.getItem('successMessage');
            if (successMessage) {
                toastr.success('Request Processed Successfully', successMessage, toastrOptions);
                localStorage.removeItem('successMessage');
            }

            // var table = $('#myTable').DataTable({
            //     "paging": false,
            //     "searching": false,
            //     "info": false,
            //     "ordering": true,
            //     "order": [
            //         [0, 'desc']
            //     ],
            //     "columnDefs": [{
            //             "orderable": true,
            //             "targets": [0]
            //         },
            //         {
            //             "orderable": false,
            //             "targets": [1, 2, 3,4]
            //         }
            //     ]
            // });
        });
    </script>
    <script>
        const STATUS_ACTIVE = {
            !!json_encode(config('constants.STATUS_ACTIVE')) !!
        };
        const STATUS_INACTIVE = {
            !!json_encode(config('constants.STATUS_INACTIVE')) !!
        };
        const STATUS_DELETED = {
            !!json_encode(config('constants.STATUS_DELETED')) !!
        };
    </script>
    <script>
        var toastrOptions = {
            "closeButton": true,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "timeOut": "3000",
        };
    </script>

    @stack('custom-js')
</body>
<div class="modal fade" id="ajax_modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">

            <!-- Static Header -->
            <div class="modal-header">
                <h5 class="modal-title" id="ajaxModalLabel"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal">

                </button>
            </div>

            <!-- Dynamic Body will be loaded here -->
            <div class="modal-body" id="ajax_modal_body">
                <!-- AJAX response will be inserted here -->
            </div>

        </div>
    </div>
</div>

</html>
