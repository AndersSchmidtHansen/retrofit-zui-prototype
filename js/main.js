$(function(){

  $ZUIState = {
    zoomed_in: false,
    current_region_index: 0,
    times: 0
  }

  $ZUIDocument = $(document)
  $ZUIWindow = $(window)
  $ZUIHtml = $('html')
  $ZUIBody = $('body')
  $ZUIRegion = $('.u-zui-region')
  var $ZUIClose

  
  // Event Handlers
  var $ZUIInitHandler = function(event) {
    var $ZUIInitialBodyStyles = {
      'transition-property': 'transform, transform-origin',
      'transition-duration': '1s',
      'transform-origin': '0px 0px',
      'transform': 'scale(1)'
    }
    location.hash = '#0'

    $ZUIRegion.each(function(){
      $(this).css('transform', 'translateZ(0)')
    })
    $ZUIBody.css($ZUIInitialBodyStyles)

    var $ZUICloseStyles = {
      'bottom': '15px',
      'right': '15px',
      'width': '48px',
      'height': '48px',
      'border-radius': '8px',
      'box-sizing': 'border-box',
      'position': 'fixed',
      'z-index': '1000',
      'background-color': 'hsl(0, 0%, 86%)',
      'box-shadow': '0 2px 2px 0 hsla(0,0%,0%,.22)',
      'font-size': '48px',
      'line-height': '1',
      'text-align': 'center',
      'cursor': 'pointer'           
    }

    $ZUIHtml.append('<div class="u-zui__close" style="display:none;">⇱</div>')

    $ZUIClose = $('.u-zui__close')
    $ZUIClose.css($ZUICloseStyles)
    $ZUIClose.on('touchstart click', $ZUIZoomOutHandler)
  }

  var $ZUIPageStateHandler = function() {
    
    if (location.hash.length > 0) {
      $ZUIState.times = parseInt(location.hash.replace('#', ''), 10)

      if ( $ZUIState.times == 0 ) {
        $ZUIClose.click()
      }

    } else {
      $ZUIState.times = 0
    }
  }

  var $ZUIZoomInHandler = function(event) {
    var $ZUITaps = event.gesture.tapCount
    var $ZUIDoubleTap = ( $ZUITaps == 2 ) ? true : false
    var $ZUICurrentRegion = $(event.target)
    var $ZUITargetXPosition = $ZUICurrentRegion.offset().left
    var $ZUITargetYPosition = $ZUICurrentRegion.offset().top

    var $ZUIZoomedInStyles = {
      'transform': 'scale(2) translateZ(0)',
      'transform-origin': $ZUITargetXPosition + 'px ' + $ZUITargetYPosition + 'px',
      'overflow-x': 'hidden'
    }

    if ( $ZUIDoubleTap ) {
      if ( !$ZUIState.zoomed_in ) {

        $ZUIState.times = 1
        location.hash = $ZUIState.times

        $ZUIBody.css($ZUIZoomedInStyles)
        $ZUIState.zoomed_in = true
        $ZUICurrentRegion.addClass('u-zui-region--in-focus')

        $ZUIClose.css({
          'bottom': ($ZUIHtml.offset().top + 15) + 'px',
          'right': ($ZUIHtml.offset().left + 15) + 'px'
        }).fadeIn()
      }
    }
  }

  var $ZUIZoomOutHandler = function(event) {
    event.preventDefault()

    var $ZUIZoomedOutStyles = {
      'transform': 'scale(1) translateZ(0)',
      'transform-origin': '0px 0px'
    }

    if ( $ZUIState.zoomed_in ) {

      $ZUIState.times = 0
      location.hash = $ZUIState.times

      $ZUIBody.css($ZUIZoomedOutStyles)
      $ZUIState.zoomed_in = false
      $('.u-zui-region--in-focus').removeClass('u-zui-region--in-focus')
      $ZUIClose.fadeOut()    
    }
  }



  var $ZUISwipeLeftHandler = function(event) {

    var $ZUINextXPosition = $ZUIRegion.eq($ZUIState.current_region_index + 1).offset().left
    var $ZUINextYPosition = $ZUIRegion.eq($ZUIState.current_region_index + 1).offset().top

    var $ZUISwipeLeftStyles = {
      'transform-origin': $ZUINextXPosition + 'px ' + $ZUINextYPosition + 'px'
    }

    if ( $ZUIState.zoomed_in ) {
      $ZUIBody
      .css($ZUISwipeLeftStyles)
      
      /*
      .stop().animate({
        scrollTop: 0,
        scrollLeft: 0
      }, 800)
      */

    }
  }

  var $ZUISwipeRightHandler = function(event) {
    var $ZUIBackXPosition = $ZUIRegion.eq($ZUIState.current_region_index - 1).offset().left
    var $ZUIBackYPosition = $ZUIRegion.eq($ZUIState.current_region_index - 1).offset().top

    var $ZUISwipeRightStyles = {
      'transform-origin': $ZUIBackXPosition + 'px ' + $ZUIBackYPosition + 'px'
    }

    if ( $ZUIState.zoomed_in ) {
      $ZUIBody
      .css($ZUISwipeRightStyles)
      .stop().animate({
        scrollTop: 0,
        scrollLeft: 0
      }, 800)
    }
  }

  var $ZUIKeyboardHandler = function(event) {
    if (event.keyCode === 27) {
      $ZUIClose.click()
    }
  } 

  // Initializing
  $ZUIDocument.on('ready', $ZUIInitHandler)
  $ZUIWindow.on('hashchange', $ZUIPageStateHandler)
  $ZUIBody.on('keyup', $ZUIKeyboardHandler)

  // Handle Zooming In
  $ZUIRegion
  .hammer()
  .on('tap', $ZUIZoomInHandler)
  .on('swipeleft', $ZUISwipeLeftHandler)
  .on('swiperight', $ZUISwipeRightHandler)

})