<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Language" content="en">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>New Admin | Log in</title>
    <meta name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no" />

    <!-- Disable tap highlight on IE -->
    <meta name="msapplication-tap-highlight" content="no">

    <link rel="stylesheet" href="{{ asset('assets/css/base.min.css') }}">

</head>

<body>
    <div class="app-container app-theme-white body-tabs-shadow">
        <div class="app-container">
            <div class="h-100 bg-plum-plate bg-animation">
                <div class="d-flex h-100 justify-content-center align-items-center">
                    <div class="mx-auto app-login-box col-md-8">
                        <div class="app-logo-inverse mx-auto mb-3"></div>
                        <div class="modal-dialog w-100 mx-auto">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div class="h5 modal-title text-center">
                                        <h4 class="mt-2">
                                            <div>Reset Password</div>
                                            <span>Please enter your email below.</span>
                                        </h4>
                                    </div>
                                    <form id="reset_pass_Form">
                                        @csrf
                                        <div class="form-row">
                                            <div class="col-md-12">
                                                <div class="position-relative form-group">
                                                    <input name="email" id="email" placeholder="Email here..."
                                                        type="email" class="form-control">
                                                    <div class="invalid-feedback" id="email_error"></div>
                                                </div>
                                            </div>
                                        </div>


                                </div>
                                <div class="modal-footer clearfix">

                                    <div class="float-right">
                                        <a href="{{ url('/') }}" class="btn-lg btn btn-link">Login</a>
                                        <button class="btn btn-primary btn-lg" id="send_email">Send Reset
                                            Link</button>
                                    </div>
                                </div>
                            </div>
                            </form>
                        </div>

                        <div class="text-center text-white opacity-8 mt-3">Copyright © ArchitectUI 2019</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js" crossorigin="anonymous"></script>
    <script src="{{ asset('assets/js/scripts-init/toastr.js') }}"></script>
    <script>
        $(document).ready(function() {

            $('input[name="email"]').on('input', function() {

                $('.invalid-feedback').empty();
                $('.form-control').removeClass('is-invalid');
            });

            $('#reset_pass_Form').on('submit', function(event) {
                event.preventDefault();


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

                var form_data = $(this).serialize();

                $.ajax({

                    url: '/sendResetLink',
                    type: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': '{{ csrf_token() }}' // Use headers to include CSRF token
                    },
                    data: form_data,
                    dataType: 'json',
                    success: function(response) {
                        console.log('Email Send successfully:', response);
                        toastr.success('Request processed successfully.',
                            "Email send",
                            toastrOptions);
                        $('#reset_pass_Form :input').prop('disabled', true);
                        $('#send_email').prop('disabled', true);
                        setTimeout(function() {
                            window.location.href = response.redirect_url;
                        }, 5000);
                    },
                    error: function(xhr) {

                        if (xhr.status === 422) {
                            var errors = xhr.responseJSON.errors;
                            console.log(errors);


                            $.each(errors, function(key, value) {
                                var field = $('#' + key);
                                var errorField = $('#' + key + '_error');
                                field.addClass('is-invalid');
                                errorField.text(value[0]).show();
                            });
                        } else {

                            console.log('An error occurred:', xhr.status, xhr
                                .statusText);
                        }
                    }

                });



            });
        });
    </script>


</html>
