var msg_tab_sel = 0;
$(document).ready(function() {
    $(document).on('click', '.fst-wrap a.user-box', function() {
        var pid = $(this).attr('data-box');
        pid = pid.replace('box-', '');
        loadMsg(pid, 'click');
        setTimeout(function() {
            var hw = $('.message-content-inner').height() * 10;
            $('.message-content-inner').animate({
                scrollTop: (hw)
            }, 100);
        }, 500);
    });

    $(document).on('click', '.snd-wrap a.user-box', function() {
        var pid = $(this).attr('data-box');
        pid = pid.replace('ubox-', '');
        loadMsg(pid, 'unk');
        setTimeout(function() {
            var hw = $('.message-content-inner').height() * 10;
            $('.message-content-inner').animate({
                scrollTop: (hw)
            }, 100);
        }, 500);
    });

    $('.message-content-inner').on('scroll', function() {
        var ttop = $(this).scrollTop();
        if (ttop < 1) {
            var pid = $('li.active-message a').attr('data-box');
            pid = pid.replace('box-', '');
            loadMsg(pid, 'scroll');
        }
    });

    setTimeout(function() {
        $('.left-msg-box .fst-wrap .user-box:eq(0)').trigger('click');
    }, 500);

    $('.msg-top-tabs .msg-tab').on('click', function() {
        $('.msg-top-tabs .msg-tab.active').removeClass('active');
        $(this).addClass('active');
        msg_tab_sel = $(this).index();
        if ($(this).index() == 0) {
            $('.snd-wrap').hide();
            $('.fst-wrap').show();
        } else {
            $('.fst-wrap').hide();
            $('.snd-wrap').show();
        }
    });

    var is_txt = true;

    $('#msg_form #upload').on('change', function() {
        var txt = '+' + this.files.length + ' files';
        $('#msg_form .upload-file-cnt').html(txt).attr('title', txt).show();
        is_txt = false;
    });

    $('#msg_form #message').on('keypress', function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            $('#msg_form button.btn-primary').trigger('click');
            return false;
        }
    });

    $('#msg_form button.btn-primary').on('click', function() {
        var msg = $('#msg_form #message').val().trim();
        if (msg == '' && is_txt) {
            $('#msg_form #message').focus();
            return false;
        }

        var to_id = $('.left-msg-box .fst-wrap.active-message a.user-box').attr('data-box');
        to_id = to_id.replace('box-', '');
        if (to_id == '') {
            $('#msg_form #message').focus();
            return false;
        }
        var form = new FormData($('#msg_form')[0]);
        form.append('act', 'msg_post');
        form.append('did', to_id);
        form.append('qid', '');
        if (typeof $('#msg_form .message-quote-select .message-quote').html() != 'undefined') {
            var qid = $('#msg_form .message-quote-select .message-quote').attr('data-pid');
            form.append('qid', qid);
        }

        $('.message-content .message-reply button').attr('disabled', 'disabled');
        $.ajax({
            url: site_url + 'common/messagepost',
            type: 'post',
            dataType: 'json',
            data: form,
            contentType: false,
            processData: false,
            cache: false,
            async: true,
            success: function(response) {
                $('.message-content .message-reply button').removeAttr('disabled');
                $('#msg_form .upload-file-cnt').html('').attr('title', '').hide();
                if (response.success) {
                    $('#msg_form')[0].reset();
                    $('#msg_form .message-quote-select').remove();
                    is_txt = true;
                    $('.message-content-inner-wrap-box[data-msgbox="' + to_id + '"').append(response.data);
                    setTimeout(function() {
                        var hw = $('.message-content-inner').height() * 10;
                        $('.message-content-inner').animate({
                            scrollTop: (hw)
                        }, 100);
                    }, 500);
                }
            },
            error: function(err) {
                $('.message-content .message-reply button').removeAttr('disabled');
                var html = '<div class="alert alert-danger alert-dismissible fade show mb-0" role="alert">Unable to sent</div>';
                $('.alert').remove();
                $('.message-content').prepend(html);
                console.log('Error: ', err);
            }
        });
    });

    $(document).on('click', '.fixed-action-btn.me ul li a i.icon-feather-edit', function() {
        var pid = $(this).closest('.message-bubble').attr('data-mg');
        var msg_in = $(this).closest('.message-bubble').find('.msgtxt').html();
        swal({
                text: 'Edit Message!',
                // content: "input",
                content: {
                    element: 'input',
                    attributes: {
                        defaultValue: msg_in,
                    }
                },
                button: {
                    text: "Update",
                    closeModal: false,
                },
            })
            .then(msg => {
                // if (!msg) throw null;
                if (!msg) {
                    swal("Error!", "Please enter message!", "error");
                    return false;
                }

                $(this).closest('.message-bubble').find('.msgtxt').html(msg);
                $(this).closest('.message-bubble').find('.message-text .icon-line-awesome-pencil').remove();
                $(this).closest('.message-bubble').find('.message-text p:eq(0)').prepend('<i class="icon-line-awesome-pencil"></i>');
                swal.stopLoading();
                swal.close();
                var form = {
                    'act': 'msg_edit',
                    'pid': pid,
                    'msg': msg,
                };
                var post_url = '?n=' + Math.round(Math.random() * 1000);
                $.ajax({
                    url: site_url + 'common/messagepost' + post_url,
                    type: 'post',
                    dataType: 'json',
                    data: form,
                    success: function(response) {},
                    error: function(err) {
                        console.log('Error: ', err);
                    }
                });
            })
            .catch(err => {
                if (err) {
                    swal("Error!", "Unable to edit!", "error");
                } else {
                    swal.stopLoading();
                    swal.close();
                }
            });
    });

    $(document).on('click', '.fixed-action-btn.me ul li a i.icon-feather-trash', function() {
        var pid = $(this).closest('.message-bubble').attr('data-mg');
        var obj = $(this).closest('.message-bubble');
        swal({
                title: "Are you sure you want to delete this message?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    var form = {
                        'act': 'msg_del',
                        'pid': pid,
                    };
                    var post_url = '?n=' + Math.round(Math.random() * 1000);
                    $.ajax({
                        url: site_url + 'common/messagepost' + post_url,
                        type: 'post',
                        dataType: 'json',
                        data: form,
                        success: function(response) {
                            if (response.success) {
                                obj.find('.message-text').html(response.data);
                            }
                        },
                        error: function(err) {
                            console.log('Error: ', err);
                        }
                    });
                }
            });
        return false;
    });

    $(document).on('click', '.fixed-action-btn ul li a i.icon-line-awesome-reply', function() {
        var pid = $(this).closest('.message-bubble').attr('data-mg');
        var msg = $(this).closest('.message-bubble').find('.message-text .msgtxt').html();
        var html = '<div class="message-quote-select"><div class="message-quote" data-pid="' + pid + '"><div><p><i class="icon-line-awesome-quote-left"></i> <i>' + msg + '</i></p></div> <a href="#" class="text-danger close"><i class="icon-feather-x"></i></a></div></div>';
        $('#msg_form .message-quote-select').remove();
        $('#msg_form').prepend(html);
    });

    $(document).on('click', '#msg_form .message-quote-select a.close', function() {
        $('#msg_form .message-quote-select').remove();
        return false;
    });

    $('.message-search input[type=text]').on('keyup', function(e) {
        var src_txt = $(this).val().toLowerCase();
        $('.message-time-sign').hide();
        $('.message-content-inner .message-content-inner-wrap-box.active-content-inner .message-bubble .message-text .msgtxt').each(function() {
            if ($(this).html().toLowerCase().indexOf(src_txt) != -1) {
                $(this).closest('.message-bubble').show();
                // $(".message-content-inner .message-content-inner-wrap-box.active-content-inner .message-bubble .message-text .msgtxt:contains('" + src_txt + "')").css("background-color", "#ffa500");
            } else {
                $(this).closest('.message-bubble').hide();
            }
        });
        if (src_txt == '') {
            $('.message-time-sign').show();
        }
    });

    $(document).on('click', '.message-bubble .message-text .fav-star', function() {
        var pid = $(this).closest('.message-bubble').attr('data-mg');
        var act = 'fav';
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            act = 'ufav';
        } else {
            $(this).addClass('active');
        }

        var form = {
            'act': 'msg_favu',
            'pid': pid,
            't': act,
        };
        var post_url = '?n=' + Math.round(Math.random() * 1000);
        $.ajax({
            url: site_url + 'common/messagepost' + post_url,
            type: 'post',
            dataType: 'json',
            data: form,
            success: function(response) {},
            error: function(err) {
                console.log('Error: ', err);
            }
        });
    });

    $('.message-content .messages-headline .fav-msg').on('click', function() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('.message-time-sign').show();
            $('.message-content-inner .message-content-inner-wrap-box.active-content-inner .message-bubble').show();
        } else {
            $(this).addClass('active');
            $('.message-time-sign').hide();
            $('.message-content-inner .message-content-inner-wrap-box.active-content-inner .message-bubble').hide();
            $('.message-content-inner .message-content-inner-wrap-box.active-content-inner .message-bubble .message-text .fav-star.active').closest('.message-bubble').show();
        }
    });

    loadLeftMsg();
    setInterval(loadLeftMsg, 30000);

});

// var moffset = parseInt(page_limit);
var user_is_load_more = [];
var user_offset = [];
var is_ajax_complete = true;
var ev_by_arr = [];
var sel_user;

function loadLeftMsg() {
    var form = {
        'act': 'load-left-message',
    };
    var post_url = '?n=' + Math.round(Math.random() * 1000);
    $.ajax({
        url: site_url + 'common/getdataajax' + post_url,
        type: 'post',
        dataType: 'json',
        data: form,
        success: function(response) {
            if (response.success) {
                $('.messages-inbox .left-msg-box').html(response.data);
                $(sel_user).parent().addClass('active-message');
                if (msg_tab_sel == 0) {
                    $('.snd-wrap').hide();
                    $('.fst-wrap').show();
                } else {
                    $('.fst-wrap').hide();
                    $('.snd-wrap').show();
                }
            }
            $('#navigation .nav-item .message-nav span').html(response.message_total);
        },
        error: function(err) {
            console.log('Error: ', err);
        }
    });
}

function loadMsg(pid, ev_by) {
    $('#msg_form')[0].reset();
    if (ev_by == 'unk') {
        $('li.active-message').removeClass('active-message');
        $('.left-msg-box .user-box[data-box="ubox-' + pid + '"]').parent().addClass('active-message');
        sel_user = '.left-msg-box .user-box[data-box="ubox-' + pid + '"]';
        var name = $('.left-msg-box .user-box[data-box="ubox-' + pid + '"] .message-by-headline h5').html();
        $('.message-content .messages-headline .headname').html(name);

        $('.message-content .messages-headline .prop-headname').html('');
        if (typeof $('.left-msg-box .user-box[data-box="ubox-' + pid + '"] .message-by .prop-dtls').html() != 'undefined') {
            var prop_title = $('.left-msg-box .user-box[data-box="ubox-' + pid + '"] .message-by .prop-dtls').html();
            var prop_link = $('.left-msg-box .user-box[data-box="ubox-' + pid + '"] .message-by .prop-dtls').attr('data-href');
            var prop_dtls = '<a href="' + prop_link + '" target="_blank">' + prop_title + '</a>';
            $('.message-content .messages-headline .prop-headname').html(prop_dtls);
        }

        $('.message-content .message-reply textarea, .message-content .message-reply input, .message-content .message-reply button').attr('disabled', 'disabled');

        if (typeof $('.message-content-inner-wrap-ubox[data-msgbox="' + pid + '"').html() == 'undefined') {
            var msg_box = '<div class="message-content-inner-wrap-ubox" data-msgbox="' + pid + '"></div>';
            $('.message-content .message-wrapper .message-content-inner').append(msg_box);
        } else {
            $('.message-content-inner > div').hide();
            $('.message-content-inner-wrap-ubox[data-msgbox="' + pid + '"').show();
            $('.active-content-inner').removeClass('active-content-inner');
            $('.message-content-inner-wrap-ubox[data-msgbox="' + pid + '"').addClass('active-content-inner');
            return false;
        }

        $('.message-content-inner > div').hide();
        $('.message-content-inner-wrap-ubox[data-msgbox="' + pid + '"').show();
        $('.active-content-inner').removeClass('active-content-inner');
        $('.message-content-inner-wrap-ubox[data-msgbox="' + pid + '"').addClass('active-content-inner');
        var temp_offset = 0;
    } else {
        $('li.active-message').removeClass('active-message');
        $('.left-msg-box .user-box[data-box="box-' + pid + '"]').parent().addClass('active-message');
        sel_user = '.left-msg-box .user-box[data-box="box-' + pid + '"]';
        var name = $('.left-msg-box .user-box[data-box="box-' + pid + '"] .message-by-headline h5').html();
        $('.message-content .messages-headline .headname').html(name);

        $('.message-content .messages-headline .prop-headname').html('');
        if (typeof $('.left-msg-box .user-box[data-box="box-' + pid + '"] .message-by .prop-dtls').html() != 'undefined') {
            var prop_title = $('.left-msg-box .user-box[data-box="box-' + pid + '"] .message-by .prop-dtls').html();
            var prop_link = $('.left-msg-box .user-box[data-box="box-' + pid + '"] .message-by .prop-dtls').attr('data-href');
            var prop_dtls = '<a href="' + prop_link + '" target="_blank">' + prop_title + '</a>';
            $('.message-content .messages-headline .prop-headname').html(prop_dtls);
        }

        $('.message-content .message-reply textarea, .message-content .message-reply input, .message-content .message-reply button').removeAttr('disabled');

        if (typeof user_offset[pid] == 'undefined') {
            user_offset[pid] = 0;
            var msg_box = '<div class="message-content-inner-wrap-box" data-msgbox="' + pid + '"></div>';
            $('.message-content .message-wrapper .message-content-inner').append(msg_box);
        }

        $('.message-content-inner > div').hide();
        $('.message-content-inner-wrap-box[data-msgbox="' + pid + '"]').show();
        $('.active-content-inner').removeClass('active-content-inner');
        $('.message-content-inner-wrap-box[data-msgbox="' + pid + '"]').addClass('active-content-inner');

        if (ev_by == 'click' && typeof ev_by_arr[pid] != 'undefined') {
            return false;
        }

        ev_by_arr[pid] = pid;

        if (typeof user_is_load_more[pid] == 'undefined') {
            user_is_load_more[pid] = true;
        }

        if (!user_is_load_more[pid] || !is_ajax_complete) {
            return false;
        }
        var temp_offset = user_offset[pid];
    }

    var form = {
        'offset': temp_offset,
        'act': 'load-message',
        'pid': pid,
    };

    if (ev_by == 'unk') {
        form['act'] = 'load-messageu';
    }

    var post_url = '?n=' + Math.round(Math.random() * 1000);
    is_ajax_complete = false;

    $.ajax({
        url: site_url + 'common/getdataajax' + post_url,
        type: 'post',
        dataType: 'json',
        data: form,
        success: function(response) {
            if (response.success) {
                var inc_offset = true;
                if (ev_by == 'unk') {
                    $('.message-content-inner-wrap-ubox[data-msgbox="' + pid + '"]').prepend(response.data);
                } else {
                    if (inc_offset) {
                        user_offset[pid] += 20; //parseInt(page_limit);
                    }
                    $('.message-content-inner-wrap-box[data-msgbox="' + pid + '"]').prepend(response.data);

                    if (typeof load_new_msg != 'undefined') {
                        clearInterval(load_new_msg);
                    }
                }
            } else {
                if (ev_by != 'unk') {
                    user_is_load_more[pid] = false;
                }
            }

            $('#navigation .nav-item .message-nav span').html(response.message_total);
            load_new_msg = setInterval(loadNewMsg, 6000, pid);
            is_ajax_complete = true;
        },
        error: function(err) {
            is_ajax_complete = true;
            console.log('Error: ', err);
        }
    });
}

function loadNewMsg(pid) {
    // var pid = $('.left-msg-box .active-message .user-box').attr('data-box');
    // if ($('.left-msg-box .active-message').hasClass('fst-wrap')) {
    //     pid = pid.replace('box-', '');
    // } else {
    //     pid = pid.replace('ubox-', '');
    // }
    var form = {
        'act': 'load-message-urd',
        'pid': pid,
    };

    var post_url = '?n=' + Math.round(Math.random() * 1000);

    $.ajax({
        url: site_url + 'common/getdataajax' + post_url,
        type: 'post',
        dataType: 'json',
        data: form,
        success: function(response) {
            if (response.success) {
                $('.message-content-inner-wrap-box[data-msgbox="' + pid + '"]').append(response.data);
                setTimeout(function() {
                    var hw = $('.message-content-inner').height() * 10;
                    $('.message-content-inner').animate({
                        scrollTop: (hw)
                    }, 100);
                }, 500);
            }
            if (response.data_ch.length > 0) {
                response.data_ch.forEach(function(value) {
                    if (typeof $('.message-bubble[data-mg="' + value.pid + '"]').html() != 'undefined') {
                        if (value.dl == 1) {
                            $('.message-bubble[data-mg="' + value.pid + '"]').find('.message-text').html(value.msg);
                        } else {
                            $('.message-bubble[data-mg="' + value.pid + '"]').find('.message-text .icon-line-awesome-pencil').remove();
                            $('.message-bubble[data-mg="' + value.pid + '"]').find('.message-text .msgtxt').html('<i class="icon-line-awesome-pencil"></i>' + value.msg);
                        }
                    }
                });
            }
            $('#navigation .nav-item .message-nav span').html(response.message_total);
        },
        error: function(err) {
            console.log('Error: ', err);
        }
    });
}