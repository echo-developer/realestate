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
    @stack('custom-css')
</head>


<body>
    <div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">
        @include('Admin.layouts.header')

        <div class="app-main">
            @include('Admin.layouts.sidebar')
            <div class="app-main__outer">
                @yield('content')

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

    <!--Perfect Scrollbar -->
    <script src="{{ asset('assets/js/vendors/scrollbar.js') }}"></script>
    <script src="{{ asset('assets/js/scripts-init/scrollbar.js') }}"></script>
    <script src="{{ asset('assets/plugins/select2/js/select2.min.js') }}"></script>
    <!--Toastr-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js" crossorigin="anonymous"></script>
    <script src="{{ asset('assets/js/scripts-init/toastr.js') }}"></script>

    {{-- WUSIWYG (CkEditor) --}}
    <script src="https://cdn.ckeditor.com/4.20.2/standard/ckeditor.js" integrity="sha384-<hash>" crossorigin="anonymous">
    </script>

    {{-- XLSX export --}}
    <script src="{{ asset('assets/js/jspdf.js') }}"></script>


    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.12.1/js/jquery.dataTables.min.js">
    </script>
    <!--SweetAlert2-->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@8"></script>
    <script src="{{ asset('assets/js/scripts-init/sweet-alerts.js') }}"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.9.3/min/dropzone.min.js"></script>
    @yield('modals')
    <script>
        const STATUS_ACTIVE = {!! json_encode(config('constants.STATUS_ACTIVE')) !!};
        const STATUS_INACTIVE = {!! json_encode(config('constants.STATUS_INACTIVE')) !!};
        const STATUS_DELETED = {!! json_encode(config('constants.STATUS_DELETED')) !!};
        var toastrOptions = {
            "progressBar": true,
            "positionClass": "toast-top-right",
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
        };
     
    </script>

    @stack('custom-js')
</body>

</html>
