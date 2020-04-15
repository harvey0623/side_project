$(function() {
	$('.seeker').on('click', function() {
		$('.seekerForgot').addClass('show');
	});

	$('.seekerCancel').on('click', function() {
		$('.seekerForgot').removeClass('show');
	});

	$('.factory').on('click', function() {
		$('.factoryForgot').addClass('show');
	});

	$('.factoryCancel').on('click', function() {
		$('.factoryForgot').removeClass('show');
	});

});