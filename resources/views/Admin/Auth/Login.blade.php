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
                                            <div>Welcome back,</div>
                                            <span>Please sign in to your account below.</span>
                                        </h4>
                                    </div>
                                    <form id="loginForm">
                                        @csrf
                                        <div class="form-row">
                                            <div class="col-md-12">
                                                <div class="position-relative form-group">
                                                    <input name="email" id="email" placeholder="Email here..."
                                                        type="email" class="form-control">
                                                    <p id="emailError" style="color: red"></p>
                                                </div>
                                            </div>
                                            <div class="col-md-12">
                                                <div class="position-relative form-group">
                                                    <input name="password" id="password" placeholder="Password here..."
                                                        type="password" class="form-control">
                                                    <p id="passwordError" style="color: red"></p>
                                                    <!-- Placeholder for password error message -->
                                                </div>
                                            </div>
                                        </div>
                                        <div class="position-relative form-check">
                                            <input name="check" id="exampleCheck" type="checkbox"
                                                class="form-check-input">
                                            <label for="exampleCheck" class="form-check-label">Keep me logged in</label>
                                        </div>
                                        <p id="err" style="color: red"></p>


                                </div>
                                <div class="modal-footer clearfix">
                                    <div class="float-left"><a href="javascript:void(0);"
                                            class="btn-lg btn btn-link">Recover Password</a></div>
                                    <div class="float-right">
                                        <button onclick="login()" class="btn btn-primary btn-lg">Login to
                                            Dashboard</button>
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
    <script>
        $(document).ready(function() {
            $('#loginForm').on('submit', function(event) {
                event.preventDefault();


                $('#emailError').text('');
                $('#passwordError').text('');
                $('#err').text('');


                var formData = $(this).serialize();
                console.log(formData);

                $.ajax({
                    url: "{{ url('/login') }}",
                    type: "POST",
                    data: formData, // Send serialized data
                    success: function(response) {
                        
                        window.location.href = response.redirect_url;

                    },
                    error: function(xhr) {
                        const response = xhr.responseJSON;

                        if (response.errors) {

                            $('#emailError').text(response.errors.email ? response.errors.email[
                                0] : '');
                            $('#passwordError').text(response.errors.password ? response.errors
                                .password[0] : '');
                        } else if (response.message) {

                            $('#err').text(response.message);
                        }
                    }
                });
            });
        });
    </script>

</html>
