var mobile = false;
var mobileBreak = 768;
if($(window).width() <= mobileBreak){mobile = true;}
var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
var path;
function freezePage(){$('body').css({'width':'100%','height':'100%','overflow':'hidden'});}
function unfreezePage(){$('body').css({'width':'','height':'','overflow':''});}
function animScroll(sec, speed, offset){
	activeOffset = $(sec).offset().top+Number(offset);	
	TweenMax.to('html,body', speed, {scrollTop:activeOffset, ease:Expo.easeInOut});
}
var zoomOffset = 0;

// disable interval while tab is open

var pageInactive = false;
$(window).focus(function() {
	pageInactive = false;
});

$(window).blur(function() {
    pageInactive = true;
});






//! - GLOBAL: WINDOW RESIZE

var winW;
var winH;
var screenH;

$(window).resize(function(){
	winW = $(window).width();
	winH = $(window).height();
	screenH = window.innerHeight;
	//console.log(winW+' / '+winH);
	
	// remove sticky if open
	if(winW<stickyBreak && stickyOpen){
		$('.sticky').removeClass('open');
		TweenMax.to($('.sticky'), .75, {'transform':'translate3d(0px, '+ -stickyH +'px, 0px)', ease:Power3.easeOut});
		stickyOpen = false;
	}
	
	// update how boxes with responsive
	updateHowBoxes();
	
	// update meet swiper
	if(winW<=700){
		if(!draggableMSOn){
			createMeetSwiper();
		}
	} else {
		if(draggableMSOn){
			removeMeetSwiper();
		}
	}
	
	// update roadmap timeline
	if(winW>750){
		if(!draggableOn){
			createTimeline();
		} else {
			updateTimeline();
		}
	} else {
		if(draggableOn){
			removeTimeline();
		}
	}
	
	// update scrollmagic for responsive
	updateScrollMagic();
	
	// set zoom offset for hero
	if(winH<=800){
		zoomOffset = 200;
	} else {
		zoomOffset = 0;
	}
	if(scrollMagicOn){
		hero_scene1.offset(zoomOffset);
	}
})
$(window).resize();





//! - GLOBAL: MENU

var menuOpen = false;
var closingMenu = false;
var menuW = $('#globalMenu').find('.menu-wrap').outerWidth();
var menuMax = 1520;
var servClosePos = (winW/2)*.475;

$('.menu-btn').click(function(){		
		
	if(!menuOpen){
		
		$('#globalMenu').addClass('open expanded');
		menuW = $('#globalMenu').find('.menu-wrap').outerWidth();
				
		// fade in menu	
		TweenMax.to('.menu-wrap', .75, {opacity:1, 'display':'block', onComplete:function(){freezePage();}})
							
		menuOpen = true;
	} else if(!closingMenu) {			
		closeMenu();	
	}
})

function closeMenu(){
	closingMenu = true;
	
	$('#globalMenu').removeClass('open');
	
	// fade out menu	
	TweenMax.to('.menu-wrap', .75, {opacity:0, 'display':'none',  onComplete:function(){
		unfreezePage();
		$('.menu-wrap').hide();
		$('#globalMenu').removeClass('expanded');
		closingMenu = false;
	}})			

	menuOpen = false;
}

// nav items go to section; close menu
$('#globalNav').find('a').click(function(){
	tmpID = $(this).attr('href');
	tmpOff = 0;
	if($(tmpID).attr('data-offset')){
		tmpOff = $(tmpID).attr('data-offset');
	}
	closeMenu();
	
	setTimeout(function(){
		animScroll($(tmpID), .75, tmpOff);
	}, 300)
	
	return false;
})

$('.sticky').find('.logo').click(function(){
	animScroll($('#hero'), .75, 0);
})

$('.artists-btn').click(function(){
	animScroll($('#partner'), .75, 0);
	return false;
})





//! - GLOBAL: CONTACT FORM

$('.field-wrap').find('input').focus(function(){
	$(this).parents('.field-wrap').addClass('on');
})
$('.field-wrap').find('input').blur(function(){
	if($(this).val() == ''){
		$(this).parents('.field-wrap').removeClass('on');
	}
})

$('.global-form').submit(function(){
	if(validateForm($(this))){
		if($(this).attr('id') == 'positionFormOverlay'){
			checkWaitlist();
		} else if($(this).attr('id') == 'stickyEmailForm' || $(this).attr('id') == 'heroEmailForm'){
			addToWaitlist($(this));
		} else {
			submitSignup($(this));
		}
		/*
		if($(this).hasClass('mailchimp')){
			submitSignup($(this));
		} else {
			sendMailForm($(this));
		}
		*/
	}
	return false;
});

/*
function sendMailForm(formObj){
	
var formSent = false;
var formURL = formObj.attr('action');

// animation actions
TweenMax.to(formObj.parents('.hasForm').find('.form-cover'), .5, {opacity:.75, 'display':'block'})
formObj.parents('section').find('button.cta-btn').addClass('disabled');

var formData = formObj.serialize();

$.ajax({
    url: formURL,
    type: 'POST',
    data: formData,
        
    success: function(result){	
	    setTimeout(function(){
		    formObj.find('input[type="text"],input[type="email"],textarea').val('');
			formObj.find('.field-wrap').removeClass('on');
			TweenMax.to(formObj.parents('.hasForm').find('.form-cover'), .5, {opacity:0, 'display':'none'})		
			formObj.parents('.hasForm').find('button.cta-btn').removeClass('disabled');
			formObj.parents('.hasForm').find('.form-btn-wrap').addClass('sent');
			if(formObj.attr('id') == 'footerEmailForm'){
				formObj.addClass('sent');
			}
		}, 1000);
    }
});

}
*/

function submitSignup(formObj){

var formSent = false;
var formURL = formObj.attr('action');

// animation actions
TweenMax.to(formObj.parents('.hasForm').find('.form-cover'), .5, {opacity:.75, 'display':'block'})
formObj.parents('section').find('button.cta-btn').addClass('disabled');

var formData = formObj.serialize();

$.ajax({
    url: formURL,
    type: 'GET',
    data: formData,
	dataType: "jsonp",
    jsonp: "c",
    contentType: "application/json; charset=utf-8",
        
    success: function(data){	
	    //console.log(data.result)
	    setTimeout(function(){
		    formObj.find('input[type="text"],input[type="email"],textarea').val('');
			formObj.find('.field-wrap').removeClass('on');
			TweenMax.to(formObj.parents('.hasForm').find('.form-cover'), .5, {opacity:0, 'display':'none'})		
			formObj.parents('.hasForm').find('button.cta-btn').removeClass('disabled');
			formObj.parents('.hasForm').find('.form-btn-wrap').addClass('sent');
			if(formObj.attr('id') == 'footerEmailForm' || formObj.attr('id') == 'stickyEmailForm'){
				formObj.addClass('sent');
			}
		}, 1000);
    }
});

	
}

function validateForm(formObj){	
	var vNum = 0;
	$(formObj).find('[data-type="req"]').each(function(){
		if($(this).val() == ""){
			$(this).parents('.field-wrap').addClass('error');
			vNum++;
		}
	});
	if(vNum==0){
		return true;
	} else {
		return false;
	}
}

$('[data-type="req"]').focus(function(){
	$(this).parents('.field-wrap').removeClass('error');
	$(this).parents('.hasForm').find('.form-btn-wrap').removeClass('sent');	
	$(this).parents('form').removeClass('sent');	
})





//! - SCROLL BASED EVENTS

var sT;

$(window).on("scrollstart",function(){
	//console.log('start scroll');
	scroll_interval = setInterval(function(){			
	
		sT = $(this).scrollTop();
		
		// update sections for animations
		//updateSectionAnim();
		
		// set sticky bar
		setSticky();
		
		// update mobile timeline nav
		if(winW<=750){
			updateMobTLNav();
		}
		
	}, 10);
})
$(window).on("scrollstop",function(){
	if(scroll_interval){
		clearInterval(scroll_interval);
		//console.log('stop scroll');
	}
})





//! - GLOBAL: STICKY ELEMENTS

var stickyOpen = false;
var stickyEmail = false;
var topDif = 0;
var stickyBreak = 980;
var stickyH = 70;
var lastSt = 0;
var autoOff = false;

function setSticky(){
	
	// drop sticky bar on scroll up
	if(sT<lastSt && winW>=stickyBreak){	
		if(!stickyOpen && sT > 110){
			$('.sticky').addClass('open');
			TweenMax.to($('.sticky'), .75, {delay:.2, 'transform':'translate3d(0px, '+ 0 +'px, 0px)', 'display':'block', ease:Power3.easeOut});	
			stickyOpen = true;
		}	
		
		// remove sticky if top of page
		if(stickyOpen && sT <= 100){
			$('.sticky').removeClass('open');
			TweenMax.to($('.sticky'), .75, {'transform':'translate3d(0px, '+ -stickyH +'px, 0px)', ease:Power3.easeOut});
			stickyOpen = false;
		}
	}
	
	// remove sticky on scroll down
	if(sT>lastSt){
		if(stickyOpen){
			$('.sticky').removeClass('open');
			TweenMax.to($('.sticky'), .75, {'transform':'translate3d(0px, '+ -stickyH +'px, 0px)', ease:Power3.easeInOut});					
			stickyOpen = false;
		}
	}
	
	if(sT<=0 && !autoOff){
		TweenMax.killTweensOf($('.sticky'));
		autoOff = true;
		TweenMax.to($('.sticky'), .75, {'transform':'translate3d(0px, '+ -stickyH +'px, 0px)', 'display':'none', ease:Power3.easeOut, onComplete:function(){
			autoOff = false;
		}});					
		
		stickyOpen = false;
	}

	
	// set email signup sticky
	/*if(sT>0 && !stickyEmail){
		stickyEmail = true;
		$('.sticky-signup').removeClass('open');
	}
	if(sT<=0 && stickyEmail){
		stickyEmail = false;
		$('.sticky-signup').addClass('open');
	}*/

	lastSt = sT;
}

$('.sticky-signup-btn').click(function(){
	stickyEmail = false;
	$('.sticky-signup').find('.form-btn-wrap').removeClass('sent');
	$('.sticky-signup').addClass('open');
})

$('.sticky-signup .close-btn').click(function(){
	if(!stickyEmail){
		stickyEmail = true;
		$('.sticky-signup').removeClass('open');
	}
})





//! PARALLAX

function isScrolledIntoView(elem, offset){
	viewDif = Number(offset);
	
    sT = Number($(document).scrollTop());
	vT = Number($(elem).offset().top)+viewDif;
	vB = sT+winH;
	vH = vT+$(elem).outerHeight()+winH;
	if((vT <= vB && vT >= sT) || (vT <= vB && vB <= vH)){
		return true;
	}
}





//! - GLOBAL: LOADER

var loadReady = false;
freezePage();

// init

var lineEases = [];
lineEases[0] = ['Power3.easeIn', 'Linear.easeNone', 'Power3.easeOut'];
lineEases[1] = ['Power3.easeIn', 'Linear.easeNone', 'Power3.easeOut'];
lineEases[2] = ['Power3.easeIn', 'Power3.easeOut', 'Power3.easeOut'];
var sp1 = .4;
var del1 = .4;
var del2 = .8;
var del3 = .25;
var fullDel = 2.9;

$('#loader').find('.line').html('<div class="line-inner"></div>');

function animateLogo(){
	// animate lines
	$('.line-group').each(function(i){
		if(i==2){ext = .1;} else {ext = 0;}
		$(this).find('.line').each(function(n){
			tmpDel = (i*del2+ext)+(n*del1);
			TweenMax.to($(this).find('.line-inner'), sp1, {delay:tmpDel, scaleX:1, ease:lineEases[i][n]})
		})			
	})
	
	// animate circles
	TweenMax.to($('.line-group[data-num="1"]').find('.circ'), sp1, {delay:fullDel, scaleX:1, scaleY:1, opacity:1, ease:Power3.easeOut})		
	TweenMax.to($('.line-group[data-num="2"]').find('.circ'), sp1, {delay:fullDel + (2*del3), scaleX:1, scaleY:1, opacity:1, ease:Power3.easeOut})		
	TweenMax.to($('.line-group[data-num="3"]').find('.circ'), sp1, {delay:fullDel + (1*del3), scaleX:1, scaleY:1, opacity:1, ease:Power3.easeOut})	
	
	// animate text
	TweenMax.to('.load-text', .75, {startAt:{scaleX:1.1, scaleY:1.1}, delay:fullDel + (2*del3)+.5, scaleX:1, scaleY:1, opacity:1, ease:Power3.easeOut, onComplete:function(){
		loadReady = true;
	}})
}

setTimeout(function(){animateLogo()}, 400);

$(window).on('load', function(){
	
	loadChecker = setInterval(function(){
		if(loadReady){
			loadSC = .8; if(winW<=650){loadSC = .4;}
			TweenMax.to('.load-clip', .5, {opacity:0, scaleX:loadSC, scaleY:loadSC, ease:Power3.easeInOut})
			TweenMax.to('#loader', .75, {delay:.2, opacity:0, 'display':'none', onComplete:function(){
				unfreezePage();
			}});
			$(window).resize();
			clearInterval(loadChecker);
		}
	}, 30)
	
})





//! - GLOBAL: OVERLAYS

var overlayOpen = false;

// partner apply

$('.footer-apply').click(function(){
	$('#overlay-partner').find('.form-btn-wrap').removeClass('sent');
	TweenMax.to('#overlay-partner', .5, {opacity:1, 'display':'block'})
	freezePage();
	overlayOpen = true;
	return false;
})

$('#overlay-partner, #overlay-position').click(function(){
	TweenMax.to($(this), .5, {opacity:0, 'display':'none', onComplete:function(){
		overlayOpen = false;
		unfreezePage();
	}})
	return false;
})

$('#overlay-partner .partner-form-overlay, #overlay-position .position-form-overlay').click(function(e){
	e.stopPropagation();
})

// team bios

$('.bio-text-wrap').click(function(){
	TweenMax.to($('#overlay-team'), .5, {opacity:0, 'display':'none', onComplete:function(){
		overlayOpen = false;
		unfreezePage();
	}})
	return false;
})

$('.team-bio').find('.bio-text').click(function(e){
	e.stopPropagation();
})

var curBio;
var totalBio = $('.bio-text-wrap').length;

$('.team-row.leadership, .team-row.advisors').find('.team-photo').click(function(){
	
	// get person id
	tmpid = $(this).parents('.team-box').attr('data-id');
	$('.bio-text').hide();
	TweenMax.set($('.bio-text[data-id="'+tmpid+'"]'), {'display':'block'})
	curBio = Number(tmpid);
	
	// fade on
	TweenMax.to('#overlay-team', .5, {opacity:1, 'display':'block'});
	
	// set min height to allow scroll based on bio
	setTimeout(function(){
		minH = $('.bio-text[data-id="'+tmpid+'"]').outerHeight()+80;
		$('.bio-text-wrap').css({'min-height':minH+'px'})
	}, 50)
	
	freezePage();
	overlayOpen = true;
	return false;
})

$('.close-btn').click(function(){
	TweenMax.to($(this).parents('.overlay'), .5, {opacity:0, 'display':'none', onComplete:function(){
		overlayOpen = false;
		unfreezePage();
	}})
	return false;
})

// init
$('.bio-text').hide();

// check position

$('.waitlist-btn').click(function(){
	//$('#overlay-position').find('.form-btn-wrap').removeClass('sent');
	TweenMax.to('#overlay-position', .5, {opacity:1, 'display':'block'})
	freezePage();
	overlayOpen = true;
	return false;
})

// waitlist form

function addToWaitlist(formObj){
	// animation actions
	TweenMax.to(formObj.parents('.hasForm').find('.form-cover'), .5, {opacity:.75, 'display':'block'})
	formObj.parents('section').find('button.cta-btn').addClass('disabled');
	
	addEmail = formObj.find('input[type="email"]').val();
	addAff = window.location.href.split('refcode=')[1];
	console.log(addAff);
	//formData = formObj.serialize();

	$.ajax({
	   url: 'https://portion.app.waitlisted.co/api/v2/reservations',
	   type: 'POST',
	   data: '{"reservation":{"email":"'+addEmail+'","affiliate": "'+addAff+'"}}',
	   contentType: "application/json; charset=utf-8",
	   dataType: "json",
	      
	    success: function(result){	
		    //console.log('-'+refcode);
		    //ab = JSON.parse(result);
		    //console.log(result);
		    getTotalWaitlist();
		    
		    setTimeout(function(){
			    formObj.find('input[type="text"],input[type="email"],textarea').val('');
				formObj.find('.field-wrap').removeClass('on');
				TweenMax.to(formObj.parents('.hasForm').find('.form-cover'), .5, {opacity:0, 'display':'none'})		
				formObj.parents('.hasForm').find('button.cta-btn').removeClass('disabled');
				formObj.parents('.hasForm').find('.form-btn-wrap').addClass('sent');
				
				retPos = result.position;
				retTot = totalWaitlist;
				retLink = result.affiliate;
				
				respTxt = 'You are '+retPos+' out of '+retTot+'.';
				respTxt += ' <a href="http://portion.io/?refcode=' + retLink + '" target="_blank">Link to share</a>';
				formObj.parents('.hasForm').find('.thanks p').html(respTxt);
				formObj.addClass('sent');

			}, 1000);
	    }, 
	    error: function(data) {
		    console.log('error')
        	rt = JSON.parse(data.responseText); 
        	errorTxt = rt.errors.email[0]; 
        	formObj.parents('.hasForm').find('.thanks p').text('That email ' + errorTxt + '.');
        	TweenMax.to(formObj.parents('.hasForm').find('.form-cover'), .5, {opacity:0, 'display':'none'})		
			formObj.parents('.hasForm').find('button.cta-btn').removeClass('disabled');
			formObj.addClass('sent');
			//$('.position-return p').text(rt.errors[0]);
			//TweenMax.to('.position-return', .5, {opacity:1})       
        }
	});
}

function checkWaitlist(){
	checkEmail = $('#positionFormOverlay').find('input[name="EMAIL"]').val();
	$('.position-return p').text('');
	TweenMax.set('.position-return', {opacity:0})
	
	$.ajax({
	    url: 'https://portion.app.waitlisted.co/api/v2/reservations',
	    type: 'GET',
	    data: 'email='+checkEmail,
	        
	    success: function(result){	
		    //console.log(result)
			retPos = result.position;
			retTot = totalWaitlist;
			$('.position-return p').text('You are '+retPos+' out of '+retTot);
			TweenMax.to('.position-return', .5, {opacity:1})
	    }, 
	    error: function(data) {
        	rt = JSON.parse(data.responseText);  
			$('.position-return p').text(rt.errors[0]);
			TweenMax.to('.position-return', .5, {opacity:1})       
        }
	});
}

// grab total waitlists on init

var totalWaitlist = 0;

function getTotalWaitlist(){
	$.ajax({
	    url: 'https://portion.app.waitlisted.co/api/v2/site',
	    type: 'GET',
	        
	    success: function(result){	
		    totalWaitlist = result.total_count;
	    }
	});
}
getTotalWaitlist();



//! - SECTION: 3 PARTNER

$('.apply-btn').click(function(){
	if(winW>550){
		trg = $('#partner').find('.form-wrap');
		if(!$('#partner').hasClass('open')){
			
			// expand content
			
			$('#partner').addClass('open');
			tmpH = trg.find('.form-contents').outerHeight();
			TweenMax.to(trg, .75, {startAt:{height:0}, height:tmpH, ease:Power3.easeInOut, onCompleteParams:[trg], onComplete:function(t){
				t.css('height','auto');
			}})
			
		} else {
		
			// submit partner form
			$('#partnerForm').submit();
			
		}
	} else {
		$('#overlay-partner').find('.form-btn-wrap').removeClass('sent');
		TweenMax.to('#overlay-partner', .5, {opacity:1, 'display':'block'})
		freezePage();
		overlayOpen = true;
	}
})

$('#partner').find('.close-btn').click(function(){
	trg = $(this).siblings('.form-wrap');
	$('#partner').removeClass('open')
	trg.css({'height':trg.find('.form-contents').outerHeight()})
	TweenMax.to(trg, .75, {height:0, ease:Power3.easeInOut})
	$('#partner').find('.form-btn-wrap').removeClass('sent');	
})





//! - SECTION: 0 HERO

// build parts

// colData = '';
// for(i=0;i<4;i++){
// 	colData += '<div class="column-lines" data-num="'+(i+1)+'">';	
// 	for(n=0;n<3;n++){
// 		colData += '<div class="column-line" data-num="'+(n+1)+'"><div class="data-line part vert"><img src="../static/images/parts/data-line-vert.svg"></div></div>';
// 	}	
// 	colData += '</div>';
// }
// $('#hero').find('.column-lines-wrap').append(colData);

colData = '';
for(i=0;i<4;i++){
	colData += '<div class="column-lines" data-num="'+(i+1)+'">';	
	for(n=0;n<3;n++){
		colData += '<div class="column-line" data-num="'+(n+1)+'"><div class="data-line-group part"><div class="data-line part vert"><img src="../static/images/parts/data-line-vert.svg"></div><div class="data-line part vert"><img src="../static/images/parts/data-line-vert.svg"></div><div class="data-line part vert"><img src="../static/images/parts/data-line-vert.svg"></div></div></div>';
	}	
	colData += '</div>';
}

$('#hero').find('.column-lines-wrap').append(colData);

				





//! - SECTION: 2 HOW



// GLOBAL

function updateHowBoxes(){
	trgW = $('.how-box[data-num="1"]').width();
	trgSh = $('.how-box[data-num="3"]');
	if(trgW < 504){
		trgSh.width(trgW);
	} else {
		trgSh.width('');
	}
}

function turnOnHow(){
	initPigs();
}
function turnOffHow(){
	resetPigs();
}



// BOX 4

pigPos = [-98, 120, 338, 556, 774];

var pigNum = 0;
var howCoinNum = 1;
var pigTimer = 2500;
var howCoinY = 370;

// init pigs

function initPigs(){
	$('.pig').each(function(i){
		$(this).attr({'data-cur':i})
		TweenMax.set($(this), {x:pigPos[i]});
		if(i<3){
			TweenMax.set($(this).find('.check'), {scaleX:0, scaleY:0, opacity:0});
		}
	})
	movePigs();
}

function movePigs(){
	
	// manual first pass
	TweenMax.to($('#how').find('.coin-group[data-num="'+howCoinNum+'"]'), 1.25, {startAt:{y:0}, y:howCoinY, ease:Power2.easeIn});
	howCoinNum++;
	TweenMax.to($('.pig[data-cur="2"]').find('.check'), .5, {delay:1.25, scaleX:1, scaleY:1, opacity:1, ease:Elastic.easeInOut.config(2,2)})
	
	pigMover = setInterval(function(){
		if(!pageInactive){
			$('.pig').each(function(){
				
				// increment position number
				nextPos = Number($(this).attr('data-cur'))+1;
				
				// if end of loop, reset and start at beginning
				if(nextPos > 4){
					TweenMax.set($(this), {x:pigPos[0]})
					TweenMax.set($(this).find('.check'), {scaleX:0, scaleY:0, opacity:0})
					nextPos = 1;
				}
				
				// update element attribute with number
				$(this).attr({'data-cur':nextPos})
				
				// slide over
				TweenMax.to($(this), 1, {x:pigPos[nextPos], ease:Power3.easeInOut})
				
				// if centered, animate check
				if(nextPos == 2){
					TweenMax.to($(this).find('.check'), .5, {delay:1.75, scaleX:1, scaleY:1, opacity:1, ease:Elastic.easeInOut.config(2,2)})
				}
			})
										
			// drop coins
			TweenMax.to($('#how').find('.coin-group[data-num="'+howCoinNum+'"]'), 1.25, {startAt:{y:0}, delay:.5, y:howCoinY, ease:Power2.easeIn});
			howCoinNum++;
			if(howCoinNum > 3){howCoinNum = 1;}
		}
	}, pigTimer)
}

function resetPigs(){
	clearInterval(pigMover);
	TweenMax.killTweensOf($('.pig'));
	TweenMax.killTweensOf($('#how').find('.coin-group'));
	$('#how').find('.coin-group').attr('style','');
	pigNum = 0;
	howCoinNum = 1;
}




// BOX 6 (DISTRIBUTION)

colData = '';
for(i=0;i<2;i++){
	colData += '<div class="column-lines" data-num="'+(i+1)+'">';	
	for(n=0;n<3;n++){
		colData += '<div class="column-line" data-num="'+(n+1)+'"><div class="data-line-group part"><div class="data-line part vert"><img src="../static/images/parts/data-line-vert2.svg"></div><div class="data-line part vert"><img src="../static/images/parts/data-line-vert2.svg"></div><div class="data-line part vert"><img src="../static/images/parts/data-line-vert2.svg"></div></div></div>';
	}	
	colData += '</div>';
}

$('#how').find('.column-lines-wrap').append(colData);

TweenMax.set($('.path-circ'), {drawSVG:'0%'});

function animDist(){
	perNum = 0;
	
	// animate percent number
	perAnim = setInterval(function(){
		perNum++;
		$('#how-dist').find('.percent-num').text(perNum+'%');
		if(perNum == 100){clearInterval(perAnim);}
	}, 30);
	
	// animate circle draw
	TweenMax.to($('.path-circ'), 3, {drawSVG:'0 100%', ease:Linear.easeNone});
	
	$('#how-dist').find('.hand').each(function(i){
		setTimeout(function(){
			$('#how-dist').find('.hand[data-num="'+(i+1)+'"]').addClass('up');
		}, 200+(500*i))
	})
}
function resetDist(){
	$('#how-dist').find('.hand').removeClass('up');
	if(perAnim){clearInterval(perAnim);}
	TweenMax.set($('.path-circ'), {drawSVG:'0%'});
}





//! - SECTION: 5a MEET SLIDESHOW (DESKTOP)

var meetW = 300;
var meetGap = 56;
var meetCur = 0;
var nextCur = 0;
var totMeetSlides = 5;

function initMeetSS(){
	meetCur = 0;
	nextCur = 0;
	updateMeetW();
	$('#meet').find('.meet-slide:not([data-num="1"])').addClass('blurred');
	$('#meet').find('.meet-slide[data-num="'+(meetCur+1)+'"]').removeClass('off blurred');
	$('#meet').find('.meet-slide[data-num="'+totMeetSlides+'"]').addClass('off');
	$('#meet').find('.counter').text('0'+(nextCur+1));
}

function updateMeetW(){
	allMeetSlides = totMeetSlides+2;
	totalMeetW = (allMeetSlides*meetW)+((allMeetSlides-1)*meetGap);
	$('.meet-slider').width(totalMeetW);
}

function updateMeetPos(){
	$('.meet-slide').each(function(i){
		tmpL = $(this).position().left - $('.meet-slides').position().left;
		$(this).attr({'data-num':(i+1), 'data-offset':tmpL});
	})
}

$('#meet').find('.arrow-btn').click(function(){
	if($(this).hasClass('left')){
		dir = -1;
	} else {
		dir = 1;
	}
	changeMeetSlider(dir);
	
	if($(this).hasClass('arrow-bouncer')){
		$(this).removeClass('arrow-bouncer')
	}
})

function initMeet(){
	if(!$('#meet').find('.arrow-btn.right').hasClass('arrow-bouncer')){
		$('#meet').find('.arrow-btn.right').addClass('arrow-bouncer');
	}
}

function changeMeetSlider(dir){

	// change active num, get new offset position
	meetCur += dir;
	nextCur = meetCur;
	newPos = (meetW*meetCur)+(meetGap*meetCur);
	
		
	// fade off slide to left of active
	if(dir == 1){
		setTimeout(function(){$('#meet').find('.meet-slide[data-num="'+meetCur+'"]').addClass('off blurred');}, 250);
	 	$('#meet').find('.meet-slide[data-num="'+Number(meetCur+1)+'"]').removeClass('off blurred');
	 	$('#meet').find('.meet-slide[data-num="'+Number(meetCur+2)+'"]').removeClass('off').addClass('blurred');
	} else {
		$('#meet').find('.meet-slide[data-num="'+Number(meetCur+1)+'"]').removeClass('off blurred');
		$('#meet').find('.meet-slide[data-num="'+Number(meetCur-2)+'"]').addClass('off');
		setTimeout(function(){$('#meet').find('.meet-slide[data-num="'+Number(meetCur+2)+'"]').addClass('blurred');}, 200);
	}
	
	
	// if last slide going forward
	if(meetCur == totMeetSlides){
		TweenMax.to($('.meet-slider'), .75, {x:-newPos, ease:Power3.easeInOut, onComplete:function(){
			TweenMax.set('.meet-slider', {x:0});
			
			// setup classes after loop
			$('#meet').find('.meet-slide').removeClass('off')
			$('#meet').find('.meet-slide[data-num="1"]').removeClass('blurred').addClass('noTrans');
			$('#meet').find('.meet-slide[data-num="2"]').addClass('blurred noTrans');
			setTimeout(function(){$('#meet').find('.meet-slide').removeClass('noTrans');}, 50);
			
			meetCur = 0;
		}})
		nextCur = 0;
	}
	
	
	// if last slide going backward
	else if(meetCur == -1){
		meetCur = totMeetSlides;
		endPos = (meetW*meetCur)+(meetGap*meetCur);
		newPos = endPos - (meetW+meetGap);
		TweenMax.set('.meet-slider', {x:-endPos});
		
		// setup classes after loop
		$('#meet').find('.meet-slide').addClass('off')
		$('#meet').find('.meet-slide[data-num="'+totMeetSlides+'"]').removeClass('blurred off');
		$('#meet').find('.meet-slide[data-num="'+(totMeetSlides+1)+'"]').removeClass('off blurred').addClass('noTrans');
		$('#meet').find('.meet-slide[data-num="'+(totMeetSlides+2)+'"]').addClass('blurred noTrans').removeClass('off');
		//setTimeout(function(){$('#meet').find('.meet-slide[data-num="'+(totMeetSlides+1)+'"]').addClass('blurred');}, 250);
		setTimeout(function(){$('#meet').find('.meet-slide').removeClass('noTrans');}, 50);
			
		TweenMax.to($('.meet-slider'), .75, {x:-newPos, ease:Power3.easeInOut})
		meetCur = totMeetSlides-1;
		nextCur = meetCur;
	}
	
	
	// default slide
	else {
		TweenMax.to($('.meet-slider'), .75, {x:-newPos, ease:Power3.easeInOut})
	}
	
	// special adjustments
	if(meetCur == 0){
		$('#meet').find('.meet-slide[data-num="'+totMeetSlides+'"]').addClass('off');
	}
					
	// change counter
	$('#meet').find('.counter').text('0'+(nextCur+1));

}





//! - SECTION: 5b MEET SWIPE (MOBILE)

var msActive = 0;

// preload images
var img = new Image();
img.src = '../static/images/slideshow/1_LogIn.jpg';
img.src = '../static/images/slideshow/2_User-Profile.jpg';
img.src = '../static/images/slideshow/3_Certificates.jpg';
img.src = '../static/images/slideshow/4_ScrollingGoods.jpg';
img.src = '../static/images/slideshow/5_Individual.jpg';

function updateMeetSwipe(){
	totalMeetW = (totMeetSlides*meetW)+((totMeetSlides-1)*meetGap);
	$('#meet-slider').width(totalMeetW);
	
	// position timeline if moved
	msX = -(msActive*meetW);
	TweenMax.set('#meet-slider', {'transform':'translate3d('+msX+'px,0,0)'})
	
	// update draggable instance for mobile
	if(draggableMS){
		updateMeetSwipeBounds();
	}
	msGridW = (meetW+meetGap);
	msBoundX = totalMeetW-meetW;
}

var draggableMSOn = false;
var draggableMS;

function buildMeetSwiper(){

	Draggable.create("#meet-slider", {
		type:"x",
		cursor:"move",
		throwProps:true,
		zIndexBoost:false,
		edgeResistance:0.65,
		allowNativeTouchScrolling: true,
		bounds: {minX:-msBoundX, maxX:0, minY:0, maxY:0},
		
		snap: {
	        x: function(endValue) {
	            return Math.round(endValue / msGridW) * msGridW;
	            
	        },
	    },
	    onThrowComplete: function(){		   
		    updateMSActive(draggableMS.x);
	    }
	});
	draggableMS = Draggable.get("#meet-slider");	
	draggableMSOn = true;
}

function updateMeetSwipeBounds(){
	draggableMS.applyBounds({minX:-msBoundX, maxX:0, minY:0, maxY:0});
}

function removeMeetSwiper(){
	TweenMax.set($('#meet-slider'), {x:0});
	draggableMS.kill();
	draggableMSOn = false;
	initMeetSS();
}

function updateMSActive(endX){
	msActive = -endX/(meetW+meetGap);
	updateMeetArrows();
}

function createMeetSwiper(){
	msActive = 0;
	updateMeetSwipe();
	buildMeetSwiper();
}

$('.swipe-cta').click(function(){
	if($(this).hasClass('left')){
		dir = -1;
	} else {
		dir = 1;
	}
	changeMeetMobile(dir);
})

function changeMeetMobile(dir){
	msActive += dir;
	newPos = -(msGridW*msActive);
	TweenMax.to('#meet-slider', .75, {x:newPos, ease:Power3.easeInOut});
	
	updateMeetArrows();
}

function updateMeetArrows(){
	if(msActive > 0 && $('#meet').find('.swipe-cta.left').hasClass('off')){$('#meet').find('.swipe-cta.left').removeClass('off')}
	if(msActive == 0 && !$('#meet').find('.swipe-cta.left').hasClass('off')){$('#meet').find('.swipe-cta.left').addClass('off')}
	if(msActive == (totMeetSlides-1) && !$('#meet').find('.swipe-cta.right').hasClass('off')){$('#meet').find('.swipe-cta.right').addClass('off')}
	if(msActive < (totMeetSlides-1) && $('#meet').find('.swipe-cta.right').hasClass('off')){$('#meet').find('.swipe-cta.right').removeClass('off')}

}

// init section based on mobile or desktop

$(window).on('load', function(){
	if(winW<=700){
		createMeetSwiper();
	} else {
		initMeetSS();
	}
})





//! - SECTION: 6 TOKEN

// GLOBAL

function turnOnToken(){
	coinDropper();
}
function turnOffToken(){
	resetCoinDrop();
}



// box 2

token2Coins = '';
coinH = 34;
var coinNum = 0;
var coinDropInt = 1000;
var cDel = 1.5;
var coinOffsetD = [.5, 0, 1];
var totCoinDrops = 6;
var coinEmptyDel = ((totCoinDrops*cDel)+.5)*1000;

for(i=0;i<3;i++){
	token2Coins += '<div class="coin-group" data-num="'+(i+1)+'">';
	
	for(n=0;n<totCoinDrops;n++){
		token2Coins += '<div class="coin part off" data-num="'+(n+1)+'"><img src="../static/images/parts/token2-coin.svg"></div>';
	}
	
	token2Coins += '</div>';
}
$('#token').find('.coin-groups').html(token2Coins);

$('#token').find('.coin-group').each(function(n){
	$(this).find('.coin').each(function(i){
		$(this).css({'transition-delay':coinOffsetD[n]+(i*cDel)+'s'})
	})
})

function coinDropper(){
	// drop coins (offset by transition delays)
	$('.coin-group').find('.coin').removeClass('off');
	
	// empty coins once full
	coinEmptier = setTimeout(function(){
		$('#token').find('.bot-line').addClass('empty');
		$('#token').find('.coin-groups').addClass('dropped');
	}, coinEmptyDel);
	
	coinRestart = setTimeout(function(){
		// reset parts
		$('#token').find('.bot-line').removeClass('empty');
		$('#token').find('.coin-groups').removeClass('dropped');
		$('.coin-group').find('.coin').addClass('off');
		
		// restart
		setTimeout(function(){coinDropper();}, 500);
	}, coinEmptyDel+1000);
}

function resetCoinDrop(){
	if(coinEmptier){
		clearTimeout(coinEmptier);
	}
	if(coinRestart){
		clearTimeout(coinRestart);
	}
	$('.coin-group').each(function(){
		$(this).find('.coin').addClass('off');
	})
	$('#token').find('.bot-line').removeClass('empty');
	$('#token').find('.coin-groups').removeClass('dropped');
}








//! - SECTION: 7 ROADMAP


// init

var tlCur = 0;
var tlW = 504;
var tlGap = 190;
var tlTotal = $('.tl-block').length;

var totalTicks = 13;
var yearMarks = [0,1,6,11];
var yearImages = ['fancy-year-2016','fancy-year-2017','fancy-year-2018','fancy-year-2019'];

var rmDataLine1 = '<div class="ornament-line" data-num="1"><img src="../static/images/roadmap-ornament-line1.svg"><div class="ornament-line-group"><div class="data-line-wrap horiz" data-num="1"></div><div class="data-line-wrap vert" data-num="2"></div><div class="data-line-wrap horiz" data-num="3"></div></div></div>';
var rmDataLine2 = '<div class="ornament-line" data-num="2"><img src="../static/images/roadmap-ornament-line2.svg"><div class="ornament-line-group"><div class="data-line-wrap horiz" data-num="1"></div><div class="data-line-wrap vert" data-num="2"></div><div class="data-line-wrap horiz" data-num="3"></div></div></div>';

$('.tl-block').each(function(i){
	if(i<$('.tl-block').length-1){
		if(i%2!=0){
			$(this).addClass('odd');
			
			// add ornament line
			$(this).prepend(rmDataLine2);
			
		} else {
			
			// add ornament line
			$(this).prepend(rmDataLine1);
		}
	}
})





// build out meter

for(i=0;i<totalTicks;i++){
	tickData = '<div class="tickmark" data-num="'+i+'"><div class="hitspot"></div><div class="inner-line"></div><div class="inner-circle"></div></div>';
	$('.tl-ticks').append(tickData);
}
$.each(yearMarks, function(i, val){
	$('.tickmark[data-num="'+val+'"]').addClass('year').append('<div class="rm-yeartext sized"><img src="../static/images/'+yearImages[i]+'.svg"></div>');
})
$('.tickmark[data-num="0"]').append('<div class="blinker"></div>').addClass('on');



// drag bar (draggable)

var draggableOn = false;
var draggable;
var tlDragW;
var tlDragTotalW;

function buildDraggable(){

	Draggable.create("#tl-drag", {
		type:"x",
		cursor:"pointer",
		throwProps:true,
		zIndexBoost:false,
		edgeResistance:0.65,
		allowNativeTouchScrolling: true,
		onDrag: moveTimeline,
		onThrowUpdate: moveTimeline,
		bounds: {minX:0, maxX:$('.tl-ticks').width(), minY:0, maxY:0},
		
		snap: {
	        x: function(endValue) {
	            return Math.round(endValue / gridW) * gridW;
	            
	        },
	    },
	    onThrowComplete: function(){		   
		    updateTLActive(draggable.x);
	    }
	});
	draggable = Draggable.get("#tl-drag");	
	draggableOn = true;
}

function updateDragBounds(){
	draggable.applyBounds({minX:$('.tl-ticks').width(), maxX:0, minY:0, maxY:0});
}

var tlRatio;
function moveTimeline(){
	TweenMax.set('#timeline-slider', {x:-(this.x*tlRatio)});
}

function updateTLActive(endX){
	tlCur = Math.round(endX/tlDragW);
	
	// update arrows
	updateArrows();
	
	// update tick mark
	updateTickmark();
	
	// turn off blinker
	switchBlinker();
}



// timeline buttons

$('#roadmap').find('.arrow-btn').click(function(){
	if(!$(this).hasClass('off')){
		if($(this).hasClass('left')){
			dir = -1;
		} else {
			dir = 1;
		}
		changeTimelineSlider(dir, '');
	}
})

$('#roadmap').find('.tickmark').click(function(){
	tmpID = $(this).attr('data-num');
	changeTimelineSlider('', tmpID);
})

function changeTimelineSlider(dir, jump){	
	// change active num, get new offset position
	if(jump == ''){
		tlCur += dir;
	} else {
		tlCur = jump;
	}
	newPos = (tlW*tlCur)+(tlGap*tlCur);
	
	// update arrows
	updateArrows();
		
	// slide timeline
	TweenMax.to($('#timeline-slider'), .75, {x:-newPos, ease:Power3.easeInOut});
	
	// auto slide drag bar
	TweenMax.to($('#tl-drag'), .75, {x:(gridW*tlCur), ease:Power3.easeInOut});
	
	// update tick mark
	updateTickmark();
	
	// turn off/on blinker
	switchBlinker();
}



// timeline update functions

function updateTimeline(){
	tlDragW = ($('.tl-ticks').width()/(totalTicks-1)).toFixed(2);
	tlDragTotalW = tlDragW*totalTicks;
	
	// position timeline if moved
	tlX = tlCur*tlDragW;
	TweenMax.set('#tl-drag', {'transform':'translate3d('+tlX+'px,0,0)'})
	
	// update draggable instance for mobile
	if(draggable){
		updateDragBounds();
	}
	
	gridW = tlDragW;
	boundX = tlDragTotalW-(tlDragW*2);
	//console.log('grid: '+tlCur+' / '+gridW+' / '+tlDragTotalW);
	
	// update ratio
	tlRatio = ((tlW+tlGap)/tlDragW).toFixed(2);
}

function updateTickmark(){
	$('.tickmark').removeClass('on');	
	$('.tickmark[data-num="'+tlCur+'"]').addClass('on');
}

function updateArrows(){
	if(tlCur > 0 && $('#roadmap').find('.arrow-btn.left').hasClass('off')){$('#roadmap').find('.arrow-btn.left').removeClass('off')}
	if(tlCur == 0 && !$('#roadmap').find('.arrow-btn.left').hasClass('off')){$('#roadmap').find('.arrow-btn.left').addClass('off')}
	if(tlCur == (tlTotal-1) && !$('#roadmap').find('.arrow-btn.right').hasClass('off')){$('#roadmap').find('.arrow-btn.right').addClass('off')}
	if(tlCur < (tlTotal-1) && $('#roadmap').find('.arrow-btn.right').hasClass('off')){$('#roadmap').find('.arrow-btn.right').removeClass('off')}
}

function switchBlinker(){
	if(tlCur > 0 && !$('#roadmap').find('.blinker').hasClass('off')){
		$('#roadmap').find('.blinker').addClass('off');
	}
	if(tlCur == 0 && $('#roadmap').find('.blinker').hasClass('off')){
		$('#roadmap').find('.blinker').removeClass('off');
	}
}



// init section based on mobile or desktop

$(window).on('load', function(){
	if(winW<=750){
		//
	} else {
		createTimeline();
	}
})

function removeTimeline(){
	$('#timeline-slider').attr({'style':''})
	draggable.kill();
	draggableOn = false;
}

function createTimeline(){
	tlTotalW = (tlTotal*tlW)+((tlTotal-1)*tlGap);
	$('#timeline-slider').width(tlTotalW);

	tlCur = 0;
	TweenMax.set($('#timeline-slider'), {x:0});
	$('#roadmap').find('.arrow-btn.left').addClass('off');
	
	updateTimeline();
	buildDraggable();
}



// mobile timeline nav

$('.tl-nav-dot').click(function(){
	$('.tl-nav-dot').removeClass('on');
	$(this).addClass('on');
	
	tmpID = $(this).attr('data-num');
	if(tmpID == 1){
		animScroll($('#roadmap'), .75, 0);
	} else {
		animScroll($('.tl-year-mobile[data-num="'+tmpID+'"]'), .75, -50);
	}
})

function updateMobTLNav(){
	$('.tl-year-mobile').each(function(i){
		if(isScrolledIntoView($(this), 0)){
			$('.tl-nav-dot').removeClass('on');
			tmpID = $(this).attr('data-num');
			$('.tl-nav-dot[data-num="'+tmpID+'"]').addClass('on');
		}
	})
}






//! - ANIMATION: SCROLLMAGIC
var hero_scene1;
function initScrollMagic(){

var controller = new ScrollMagic.Controller();


	// hero animations	
	var hero_timeline = new TimelineMax();
	var hero_tween1 = new TweenMax($('#hero').find('.door.left'), 1, {x:-40, ease:Quad.easeInOut});
	var hero_tween2 = new TweenMax($('#hero').find('.door.right'), 1, {x:40, ease:Quad.easeInOut});	
	hero_timeline.add(hero_tween1,0).add(hero_tween2,0);
	  
	hero_scene1 = new ScrollMagic.Scene({
			triggerElement: "#hero",
			triggerHook: 0,
			duration: winH/3		
		})
		.setTween(hero_timeline)
		.addTo(controller);
		
	// turn off signup sticky at footer
	
	var footerScene = new ScrollMagic.Scene({
			triggerElement: "#globalFooter",
			triggerHook: 1,
			offset: 0,
			duration: $("#globalFooter").outerHeight()+300
		})
		.addTo(controller);	
		footerScene.setClassToggle(".sticky-signup", "off");
	
	
	// 01 what section
	
	var whatScene = new ScrollMagic.Scene({
			triggerElement: "#what",
			triggerHook: 2,
			duration: winH+$('#what').outerHeight()
		})
		.addTo(controller);	
		whatScene.setClassToggle("#what", "on");	
	
	
	// 02 how section
	
	var howScene = new ScrollMagic.Scene({
			triggerElement: "#how",
			triggerHook: 2,
			duration: winH+$('#how').outerHeight()
		})
		.on('enter',function(){
			turnOnHow();
		})
		.on('leave',function(){
			turnOffHow();
		})
		.addTo(controller);	
		howScene.setClassToggle("#how", "on");
		
	var distScene = new ScrollMagic.Scene({
			triggerElement: "#how-dist",
			triggerHook: 2,
			offset: 300,
			duration: winH+$('#how-dist').outerHeight(),
		})
		.on('enter',function(){
			animDist();
		})
		.on('leave',function(){
			resetDist();
		})
		.addTo(controller);	
				
		
	// 04 finance section
	
	var financeScene = new ScrollMagic.Scene({
			triggerElement: "#financial",
			triggerHook: 2,
			offset: winH/3,
			duration: winH+$('#financial').outerHeight()
		})
		.addTo(controller);	
		financeScene.setClassToggle("#financial", "on");
			
		
	// 05 meet section
	
	var meetScene = new ScrollMagic.Scene({
			triggerElement: "#meet",
			triggerHook: 2,
			duration: winH+$('#meet').outerHeight()
		})
		.on('enter',function(){
			initMeet();
		})
		.addTo(controller);	
		meetScene.setClassToggle("#meet", "on");
		
		
	// 06 token section
	
	var tokenScene = new ScrollMagic.Scene({
			triggerElement: "#token",
			triggerHook: 2,
			duration: winH+$('#token').outerHeight()
		})
		.on('enter',function(){
			turnOnToken();
		})
		.on('leave',function(){
			turnOffToken();
		})
		.addTo(controller);	
		tokenScene.setClassToggle("#token", "on");
		
		
	// 07 roadmap section
	
	var roadmapScene = new ScrollMagic.Scene({
			triggerElement: "#roadmap",
			triggerHook: 2,
			duration: winH+$('#roadmap').outerHeight()
		})
		.addTo(controller);	
		roadmapScene.setClassToggle("#roadmap", "on");
		
		
	// 09 footer section
	
	var footerScene = new ScrollMagic.Scene({
			triggerElement: "#globalFooter",
			triggerHook: 2,
			duration: winH+$('#globalFooter').outerHeight()
		})
		.addTo(controller);	
		footerScene.setClassToggle("#globalFooter", "on");
		
	
	// meet swipe cta
	
	var meetSwipe = new ScrollMagic.Scene({
			triggerElement: "#meet",
			triggerHook: 0,
			offset: $('#meet').outerHeight()/3-200,
			duration: $('#meet').outerHeight()/2+50
		})
		.addTo(controller);	
		meetSwipe.setClassToggle("#meet", "swipe");
		
		
		
	// mobile timeline pin
	
	if(winW<=750){
	var tlNavScene = new ScrollMagic.Scene({
			triggerElement: ".tl-nav-mobile",
			triggerHook: 0,
			offset: -100,
			duration: $('#timeline-slider').height()-550
		})
		.setPin(".tl-nav-mobile")
		.addTo(controller);	
	}
	
	smInit = true;
	updateScrollMagic();
}

var scrollMagicOn = true;
initScrollMagic();

// for responsive
var smInit = false;
function updateScrollMagic(){
	if(smInit){
	
	/*if(winW<=650 && scrollMagicOn){
		hero_scene1.enabled(false);
		scrollMagicOn = false;
	} else if(winW>650 && !scrollMagicOn){
		hero_scene1.enabled(true);
		scrollMagicOn = true;
	}*/
	
	hero_scene1.enabled(true);
	scrollMagicOn = true;
		
	}
}





//! - ANIMATION: GLOBAL

var vlineData = '';
vlineData += '<div class="center-line"></div>';
vlineData += '<div class="data-line part vert" data-num="1"><img src="../static/images/parts/data-line-vert.svg"></div>';
vlineData += '<div class="data-line part vert" data-num="2"><img src="../static/images/parts/data-line-vert.svg"></div>';
vlineData += '<div class="data-line part vert" data-num="3"><img src="../static/images/parts/data-line-vert.svg"></div>';
vlineData += '<div class="data-line part vert" data-num="4"><img src="../static/images/parts/data-line-vert.svg"></div>';
$('.v-line-anim').html(vlineData);


var dlineDataH = '<div class="data-line part horiz"><img src="../static/images/parts/data-line-horiz.svg"></div><div class="data-line part horiz"><img src="../static/images/parts/data-line-horiz.svg"></div>';
var dlineDataV = '<div class="data-line part vert"><img src="../static/images/parts/data-line-vert.svg"></div><div class="data-line part vert"><img src="../static/images/parts/data-line-vert.svg"></div>';
$('.data-line-wrap.horiz').html(dlineDataH);
$('.data-line-wrap.vert').html(dlineDataV);


// for multi line parts

function popMultiData(dir,tot,gap){
	if(dir == 'vert'){
		axis = 'Y';
	} else {
		axis = 'X';
	}
	colData = '';
	for(n=0;n<2;n++){
		colData += '<div class="data-line-group part">';
		for(i=0;i<tot;i++){
			colData += '<div class="data-line part '+dir+'" style="transform:translate'+axis+'('+(gap*i)+'px);"><img src="../static/images/parts/data-line-'+dir+'.svg"></div>';	
		}
		colData += '</div>';
	}
	return colData;
}

$('#globalFooter').find('.data-line-wrap[data-num="1"]').html(popMultiData('vert',2,150));
$('#globalFooter').find('.data-line-wrap[data-num="4"]').html(popMultiData('vert',5,170));

$('#meet').find('.data-line-wrap[data-num="1"]').html(popMultiData('horiz',5,200));

$('#roadmap').find('.ornament-line.end.left').find('.data-line-wrap[data-num="1"]').html(popMultiData('horiz',3,200));
$('#roadmap').find('.ornament-line.end.right').find('.data-line-wrap[data-num="3"]').html(popMultiData('horiz',6,200));

$('#hero').find('.ornament-line-group[data-num="3"]').find('.data-line-wrap[data-num="1"]').append(dlineDataV);




