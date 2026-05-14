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
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/custom.css') }}">

</head>

<body>
    <div class="app-container app-theme-white bg-light bg-animation body-tabs-shadow">
        <div class="container">
            <div class="vh-100">
                <div class="row vh-100 justify-content-center align-items-center">
                    <div class="app-login-box col-xxl-4 col-xl-5 col-lg-6 col-md-8 col-sm-10">
                        <div class="card border-0 rounded-4">
                            <div class="card-body">
                                <div class="text-center mt-2 mb-4">
                                    <div class="mb-3">
                                        <img src="{{ asset('assets/images/logo.png') }}" alt="Logo" height="56">
                                    </div>
                                    <p>Please sign in to your account below.</p>
                                </div>
                                @error('account')
                                    <div class="alert alert-danger">{{ $message }}</div>
                                @enderror
                                <form id="loginForm">
                                    @csrf

                                    <div class="form-floating mb-4">
                                        <input name="username" id="username" placeholder="Username here..."
                                            type="text" class="form-control">
                                        <label for="username">Username</label>
                                        <p id="usernameError" class="text-danger small"></p>
                                    </div>

                                    <div class="form-floating mb-4">
                                        <input name="password" id="password" placeholder="Password here..."
                                            type="password" class="form-control">
                                        <label for="password">Password</label>
                                        <p id="passwordError" class="text-danger small"></p>
                                    </div>

                                    <div class="row">
                                        <div class="col">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value=""
                                                    name="check" id="exampleCheck">
                                                <label class="form-check-label small text-muted" for="exampleCheck">
                                                    Keep me logged in
                                                </label>
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <a href="{{ url('password_recover_form') }}" class="small">Recover
                                                Password</a>
                                        </div>
                                    </div>

                                    <p id="err" class="text-danger small"></p>

                                    <div class="d-grid">
                                        <button onclick="login()" class="btn btn-primary">Login</button>
                                    </div>

                                </form>
                            </div>



                        </div>

                        <div class="text-center text-muted small mt-3">Copyright © Realestate Pvt. Ltd. 2025</div>
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


                $('#usernameError').text('');
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
