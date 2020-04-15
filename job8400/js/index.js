$(function () {
	var slickOption = {
		arrows: false,
		autoplay: true,
		dots: true,
		auotplaySpeed: 5000,
	};

	function slick1Init() {
		$('.companySlick1').slick(slickOption);
		$('.companySlick2').slick(slickOption);
		$('.adSlick').slick({
			arrows: false,
			autoplay: true,
			dots: false,
			auotplaySpeed: 5000,
		});
	}

	slick1Init();

});