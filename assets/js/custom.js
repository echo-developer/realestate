/* ----------------- Start Document ----------------- */
(function($) {
    "use strict";
    $(document).ready(function() {
        /*--------------------------------------------------*/
        /*  Mobile Menu - mmenu.js
        /*--------------------------------------------------*/
        $(function() {
            function mmenuInit() {
                var wi = $(window).width();
                if (wi <= '991') {
                    $(".mmenu-init").remove();
                    /*$("#navigation").clone().addClass("mmenu-init").insertBefore("#navigation").removeAttr('id').removeClass('style-1 style-2')
                    	.find('ul, div').removeClass('style-1 style-2 mega-menu mega-menu-content mega-menu-section').removeAttr('id');*/

                    if ($('.user-sidebar').length == 1) {
                        var profile_name = $(".user-sidebar").find('.user-profile').find('h5').text();
                        var html = '<div class="mmenu-init"><ul>';
                        $('.user-sidebar > ul').each(function() {
                            html = html + $(this).html();
                        })
                        html = html + '</ul></div>';
                        $("#navigation").before(html);
                    } else {
                        $("#navigation").clone().addClass("mmenu-init").insertBefore("#navigation").removeAttr('id').removeClass('style-1 style-2')
                            .find('ul, div').removeClass('style-1 style-2 mega-menu mega-menu-content mega-menu-section').removeAttr('id');
                        $(".mmenu-init").find("ul").addClass("mm-listview");
                        $(".mmenu-init").find(".mobile-styles .mm-listview").unwrap();

                        $(".user-sidebar").clone().addClass("mmenu-init").insertBefore("#navigation").removeAttr('id').removeClass('style-1 style-2')
                            .find('div').remove();
                    }

                    $(".mmenu-init").find("ul").addClass("mm-listview");
                    $(".mmenu-init").find(".mobile-styles .mm-listview").unwrap();

                    $(".mmenu-init").mmenu({
                        "counters": true
                    }, {
                        // configuration
                        offCanvas: {
                            pageNodetype: "#wrapper"
                        }
                    });

                    var mmenuAPI = $(".mmenu-init").data("mmenu");
                    var $icon = $(".mmenu-trigger .hamburger");

                    $(".mmenu-trigger").on('click', function() {
                        mmenuAPI.open();
                    });

                }
                $(".mm-next").addClass("mm-fullsubopen");
                if ($('.user-sidebar').length == 1) {
                    $(".mmenu-init").find('#mm-1').find('.mm-title').html(profile_name);
                }
            }
            mmenuInit();
            $(window).resize(function() {
                mmenuInit();
            });
        });



        function stickyHeader() {
            if ($('#header-container').length && $('#header-container').hasClass('header-sticky')) {
                //console.log('ok');
                var header_position = $('#header-container').offset(),
                    lastScroll = 80;
                $(window).on('scroll load', function(event) {
                    var st = $(this).scrollTop();
                    if (st > header_position.top) {
                        $('#header-container').addClass("header-fixed");
                        $('#header-container').removeClass("transparentH");
                    } else {
                        $('#header-container').removeClass("header-fixed");
                        $('#header-container').addClass("transparentH");
                    }

                    if (st > lastScroll && st > header_position.top) {
                        $('#header-container').addClass("hidden-menu");                        
                    } else if (st <= lastScroll) {
                        $('#header-container').removeClass("hidden-menu");
                    }

                    lastScroll = st;

                    if (st === 0) {
                        $('#header-container').removeClass("header-fixed");
                    }
                });
            }
        }
        // Sticky Header Init
        stickyHeader();


        /*--------------------------------------------------*/
        /*  Transparent Header Spacer Adjustment
        /*--------------------------------------------------*/
        $(window).on('load resize', function() {
            var transparentHeaderHeight = $('.transparent-header').outerHeight();
            $('.transparent-header-spacer').css({
                height: transparentHeaderHeight,
            });
        });

        // Fun Facts
        // Fun Facts
        function funFacts() {
            /*jslint bitwise: true */
            function hexToRgbA(hex) {
                var c;
                if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
                    c = hex.substring(1).split('');
                    if(c.length === 3){
                        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
                    }
                    c = '0x' + c.join('');
                    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
                }
            }
        
            function lightenColor(hex, percent) {
                var r = parseInt(hex.slice(1, 3), 16);
                var g = parseInt(hex.slice(3, 5), 16);
                var b = parseInt(hex.slice(5, 7), 16);
        
                r = Math.min(255, Math.floor(r + (255 - r) * percent));
                g = Math.min(255, Math.floor(g + (255 - g) * percent));
                b = Math.min(255, Math.floor(b + (255 - b) * percent));
        
                return `rgba(${r}, ${g}, ${b}, 0.2)`;
            }
        
            $(".fun-fact").each(function() {
                var factColor = $(this).attr('data-fun-fact-color');
        
                if(factColor !== undefined) {
                    var lightColor = lightenColor(factColor, 0.5); // 50% lighter
                    $(this).css('background-color', lightColor);
                    $(this).find(".fun-fact-icon").css('background-color', hexToRgbA(factColor));
                    $(this).find("i").css('color', factColor);
                }
            });
        }
        
        funFacts();

        /*  Star Rating
        /*--------------------------------------------------*/
        function starRating(ratingElem) {

            $(ratingElem).each(function() {

                var dataRating = $(this).attr('data-rating');

                // Rating Stars Output
                function starsOutput(firstStar, secondStar, thirdStar, fourthStar, fifthStar) {
                    return(''+
                        '<span class="'+firstStar+'"></span>'+
                        '<span class="'+secondStar+'"></span>'+
                        '<span class="'+thirdStar+'"></span>'+
                        '<span class="'+fourthStar+'"></span>'+
                        '<span class="'+fifthStar+'"></span>');
                }

                var fiveStars = starsOutput('star','star','star','star','star');

                var fourHalfStars = starsOutput('star','star','star','star','star half');
                var fourStars = starsOutput('star','star','star','star','star empty');

                var threeHalfStars = starsOutput('star','star','star','star half','star empty');
                var threeStars = starsOutput('star','star','star','star empty','star empty');

                var twoHalfStars = starsOutput('star','star','star half','star empty','star empty');
                var twoStars = starsOutput('star','star','star empty','star empty','star empty');

                var oneHalfStar = starsOutput('star','star half','star empty','star empty','star empty');
                var oneStar = starsOutput('star','star empty','star empty','star empty','star empty');

                // Rules
                if (dataRating >= 4.75) {
                    $(this).append(fiveStars);
                } else if (dataRating >= 4.25) {
                    $(this).append(fourHalfStars);
                } else if (dataRating >= 3.75) {
                    $(this).append(fourStars);
                } else if (dataRating >= 3.25) {
                    $(this).append(threeHalfStars);
                } else if (dataRating >= 2.75) {
                    $(this).append(threeStars);
                } else if (dataRating >= 2.25) {
                    $(this).append(twoHalfStars);
                } else if (dataRating >= 1.75) {
                    $(this).append(twoStars);
                } else if (dataRating >= 1.25) {
                    $(this).append(oneHalfStar);
                } else if (dataRating < 1.25) {
                    $(this).append(oneStar);
                }

            });

        } starRating('.star-rating');                

        $('.footer-links > h4 > a').click(function() {
            var $this = $(this);  // Cache the clicked element
            var $ul = $this.parent().parent().find('ul.foot-nav');  // Find the corresponding ul
            
            // Close all other open foot-nav elements
            $('.footer-links > ul.foot-nav').not($ul).slideUp('slow');
            
            // Toggle the clicked ul and its 'active' class
            $ul.stop(true, true).slideToggle('slow');
            $this.toggleClass('active');
        });        
        
        $('#filter').click(function() {
            $('.filter').slideToggle('slow');
            $('body').addClass('overflow-none');
        });
        $('.close_filter').click(function() {
            $('.filter').slideToggle('slow');
            $('body').removeClass('overflow-none');
        });
        var w = $(window).width();
        if (w < 992) {
            $('.messages-inbox ul > li').click(function() {
                $('.message-content').show();
                $('.messages-inbox').hide();
            });
            $('.back-message').click(function() {
                $('.message-content').hide();
                $('.messages-inbox').show();
            });
        }
        if (typeof($('.phone-number').html() != 'undefined')) {
            $('.phone-number').on('keypress', function(e) {
                if (e.keyCode == 46) {
                    return false;
                }
            });
        }

    });
})(this.jQuery);


