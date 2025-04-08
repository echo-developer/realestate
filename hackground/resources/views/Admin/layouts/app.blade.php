<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Language" content="en">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="icon" href="{{ asset('favicon.ico') }}" type="image/x-icon">
    <title>New Admin | Admin</title>
    <meta name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- Disable tap highlight on IE -->
    <meta name="msapplication-tap-highlight" content="no">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.9.3/min/dropzone.min.css">
    <link rel="stylesheet" href="{{ asset('assets/css/base.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/js/scripts-init/select2/dist/css/select2.min.css') }}">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"
        integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.bundle.min.js" crossorigin="anonymous">
    </script>
    <script src="https://cdn.jsdelivr.net/npm/metismenu"></script>
    <script src="{{ asset('assets/js/scripts-init/app.js') }}"></script>
    <script src="{{ asset('assets/js/scripts-init/demo.js') }}"></script>


    <!--Toggle Switch -->
    <script src="{{ asset('assets/js/vendors/form-components/toggle-switch.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!--Perfect Scrollbar -->
    <script src="{{ asset('assets/js/vendors/scrollbar.js') }}"></script>
    <script src="{{ asset('assets/js/scripts-init/scrollbar.js') }}"></script>
    <script src="{{ asset('assets/plugins/select2/js/select2.min.js') }}"></script>
    <!--Toastr-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js" crossorigin="anonymous"></script>


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
    <script src="{{ asset('assets/js/scripts-init/select2/dist/js/select2.full.min.js') }}"></script>

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
  
  <script>
        $(document).ready(function() {
            // Ensure modal closes when clicking close button or outside the modal
            $('#Modal').on('hidden.bs.modal', function() {
                $(this).find("form").trigger("reset"); // Reset form fields after closing
            });

            // Close modal on close button click
            $('.close, .btn-secondary').on('click', function() {
                $('#Modal').modal('hide');
            });
        });
    </script>
    @stack('custom-js')
</body>
<div class="modal fade" id="ajax_modal" tabindex="-1" role="dialog" aria-labelledby="ajax_modal" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">

        </div>
    </div>
</div>



</html>