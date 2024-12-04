/*********************************************************************************

	Template Name: Reyes Bootstrap4 Template
	Version: 1.0

**********************************************************************************/

(function ($) {
	'use strict';

	/* Testimonial Slider Active 1 */
	$('.testimonial-activation').slick({
		dots: false,
		infinite: true,
		speed: 300,
		slidesToShow: 1,
		centerMode: true,
		centerPadding: '0',
	});

	/* Testimonial Slider Active 2 */
	$('.testimonial-activation-2').slick({
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		arrows: false,
		autoplay: false,
		centerMode: true,
		focusOnSelect: true,
		centerPadding: '0',
		responsive: [{
				breakpoint: 1200,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1
				}
			},
			{
				breakpoint: 576,
				settings: {
					slidesToShow: 1
				}
			}
		]
	});


	/* testimonial activation 3 */

	$('.testimonial-activation-4').slick({
		slidesToShow: 1,
		autoplay: false,
		autoplaySpeed: 5000,
		arrows: false,
		easing: 'ease-in-out',
		dots: true,
		dotsClass: 'testi-pagination-dots',
		appendDots: $('.testimonial-pagination')
	});


	/* testimonial activation 4 */

	$('.testimonial-for').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		fade: true,
		asNavFor: '.testimonal-nav'
	});

	$('.testimonal-nav').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		asNavFor: '.testimonial-for',
		dots: true,
		centerMode: true,
		focusOnSelect: true,
		centerPadding: '0',
		arrows: false,

		responsive: [{
				breakpoint: 769,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 769,
				settings: {
					slidesToShow: 1
				}
			},
			{
				breakpoint: 575,
				settings: {
					slidesToShow: 1
				}
			}
		]

	});

	/* Testimonial Slider Active 5 */

	$('.testimonial-activation-6').slick({
		slidesToShow: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		easing: 'ease-in-out',
		dots: false,
		arrows: true,
		prevArrow: '<button class="testimonial-arrow-prev"><i class="fa fa-angle-left"></i></button>',
		nextArrow: '<button class="testimonial-arrow-next"><i class="fa fa-angle-right"></i></button>',
	});


	/* Testimonial Slider Active 6 */

	$('.testimonial-activation-7').slick({
		slidesToShow: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		easing: 'ease-in-out',
		dots: false,
		arrows: true,
		prevArrow: '<button class="testimonial-arrow-prev"><i class="ion ion-md-arrow-back"></i></button>',
		nextArrow: '<button class="testimonial-arrow-next"><i class="ion ion-md-arrow-forward"></i></button>',
	});


	/* Testimonial Slider Active 7 */

	$('.testimonial-activation-8').slick({
		slidesToShow: 1,
		autoplay: false,
		autoplaySpeed: 5000,
		easing: 'ease-in-out',
		dots: false,
		arrows: true,
		prevArrow: '<button class="testimonial-arrow-prev"><i class="ion ion-md-arrow-back"></i></button>',
		nextArrow: '<button class="testimonial-arrow-next"><i class="ion ion-md-arrow-forward"></i></button>',
	});


	/*==================================
		06. Testimonial Carousel Style
	=====================================*/

	/* Testimonial Carousel 1*/

	$('.testimonial-carousel-1').slick({
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		dots: false,
		arrows: true,
		prevArrow: '<button class="testimonial-arrow-prev"><i class="fa fa-angle-left"></i></button>',
		nextArrow: '<button class="testimonial-arrow-next"><i class="fa fa-angle-right"></i></button>',
		autoplay: false,
		centerMode: true,
		focusOnSelect: true,
		centerPadding: '0',

		responsive: [{
				breakpoint: 1200,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1
				}
			},
			{
				breakpoint: 576,
				settings: {
					slidesToShow: 1
				}
			}
		]
	});

	/*Testimonial Carousel 2*/

	$('.testimonial-carousel-2').slick({
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		dots: true,
		arrows: true,
		prevArrow: '<button class="testimonial-arrow-prev"><i class="fa fa-angle-left"></i></button>',
		nextArrow: '<button class="testimonial-arrow-next"><i class="fa fa-angle-right"></i></button>',
		autoplay: false,
		centerMode: true,
		focusOnSelect: true,
		centerPadding: '0',

		responsive: [{
				breakpoint: 1200,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1
				}
			},
			{
				breakpoint: 576,
				settings: {
					slidesToShow: 1
				}
			}
		]
	});

	/* Testimonial Carousel 3*/

	$('.testimonial-carousel-3').slick({
		infinite: true,
		speed: 500,
		slidesToShow: 2,
		slidesToScroll: 1,
		dots: true,
		arrows: false,
		autoplay: false,
		centerMode: true,
		focusOnSelect: true,
		centerPadding: '0',

		responsive: [{
				breakpoint: 1200,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1
				}
			},
			{
				breakpoint: 576,
				settings: {
					slidesToShow: 1
				}
			}
		]
	});



	/* Testimonial Carousel 4*/

	$('.testimonial-carousel-4').slick({
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		dots: false,
		arrows: false,
		autoplay: true,
		centerMode: true,
		focusOnSelect: true,
		centerPadding: '0',
		responsive: [{
				breakpoint: 1200,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1
				}
			},
			{
				breakpoint: 576,
				settings: {
					slidesToShow: 1
				}
			}
		]
	});


	/* Testimonial Carousel 5*/

	$('.testimonial-carousel-5').slick({
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		dots: false,
		arrows: true,
		prevArrow: '<button class="testimonial-arrow-prev"><i class="fa fa-angle-left"></i></button>',
		nextArrow: '<button class="testimonial-arrow-next"><i class="fa fa-angle-right"></i></button>',
		autoplay: false,

		centerMode: true,
		focusOnSelect: true,
		centerPadding: '0',
		responsive: [{
				breakpoint: 1200,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1
				}
			},
			{
				breakpoint: 576,
				settings: {
					slidesToShow: 1
				}
			}
		]
	});
	

})(jQuery);