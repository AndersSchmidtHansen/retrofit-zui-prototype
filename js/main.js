$(function(){

  $ZUIState = {
    zoomed_in: false,
    zui_regions: [],
    total_zui_regions: 0,
    currently_focused_region: {},
    current_region_index: 0,
    times: 0,
    zoom_speed: '.75s'
  }

  $ZUIDocument = $(document)
  $ZUIWindow = $(window)
  $ZUIHtml = $('html')
  $ZUIBody = $('body')
  $ZUIRegion = $('.u-zui-region')
  var $ZUIClose

  /*
  |----------------------------------------------------------------------
  | Initial Set Up
  |----------------------------------------------------------------------
  */
  var $ZUIInitHandler = function(event) {

    var $ZUIInitialBodyStyles = {
      'transition-property': 'transform, transform-origin',
      'transition-duration': $ZUIState.zoom_speed,
      'transform-origin': '0px 0px',
      'transform': 'scale(1)'
    }
    location.hash = '#0'

    $ZUIRegion.each(function(index){
      $(this)
      .css('transform', 'translateZ(0)')
      .attr('data-zui-id', index++)
      $ZUIState.zui_regions.push($(this))
    })

    $ZUIState.total_zui_regions = $ZUIState.zui_regions.length

    console.log('There are ' + $ZUIState.total_zui_regions + ' ZUI Regions present on this page.')

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

  /*
  |----------------------------------------------------------------------
  | Handling Page State - Enables Android Back Buttons To Zoom Out
  |----------------------------------------------------------------------
  */
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

  /*
  |----------------------------------------------------------------------
  | Zooming In
  |----------------------------------------------------------------------
  */
  var $ZUIZoomInHandler = function(event) {
    var $ZUITaps = event.gesture.tapCount
    var $ZUIDoubleTap = ( $ZUITaps == 2 ) ? true : false
    var $ZUICurrentRegion = $(event.target)
    var $ZUITargetXPosition = $ZUICurrentRegion.offset().left
    var $ZUITargetYPosition = $ZUICurrentRegion.offset().top

    var $ZUIZoomedInStyles = {
      'transform': 'scale(2) translateZ(0)',
      'transform-origin': $ZUITargetXPosition + 'px ' + $ZUITargetYPosition + 'px'
    }

    if ( $ZUIDoubleTap ) {
      if ( !$ZUIState.zoomed_in ) {

        $ZUIState.times = 1
        location.hash = $ZUIState.times

        $ZUIBody.css($ZUIZoomedInStyles)
        $ZUIState.zoomed_in = true
        $ZUICurrentRegion.addClass('u-zui-region--in-focus')
        $ZUIState.currently_focused_region = $ZUICurrentRegion
        $ZUIState.current_region_index = $ZUICurrentRegion.data('zui-id')

        $ZUIClose.css({
          'bottom': ($ZUIHtml.offset().top + 15) + 'px',
          'right': ($ZUIHtml.offset().left + 15) + 'px'
        }).fadeIn()
      }

      console.log($ZUIState.current_region_index)
    }
  }

  /*
  |----------------------------------------------------------------------
  | Zooming Out
  |----------------------------------------------------------------------
  */
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
      $ZUIState.currently_focused_region.removeClass('u-zui-region--in-focus')
      $ZUIClose.fadeOut()
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Swiping Right To Left
  |--------------------------------------------------------------------------
  */  
  var $ZUISwipeLeftHandler = function(event) {
    
    if ( ($ZUIState.current_region_index + 1) >= $ZUIState.total_zui_regions ) {
      return false
    }

    var $ZUINextXPosition = $($ZUIState.zui_regions[$ZUIState.current_region_index + 1]).offset().left
    var $ZUINextYPosition = $($ZUIState.zui_regions[$ZUIState.current_region_index + 1]).offset().top

    $ZUIState.current_region_index = $ZUIState.current_region_index += 1

    var $ZUISwipeLeftStyles = {
      'transform-origin': $ZUINextXPosition + 'px ' + $ZUINextYPosition + 'px'
    }

    if ( $ZUIState.zoomed_in ) {
      $ZUIBody.css($ZUISwipeLeftStyles)
    }
  }

  /*
  |----------------------------------------------------------------------
  | Swiping From Left To Right
  |----------------------------------------------------------------------
  */
  var $ZUISwipeRightHandler = function(event) {
    
    if ( $ZUIState.current_region_index <= 0 ) {
      return false
    }

    var $ZUIPrevXPosition = $($ZUIState.zui_regions[$ZUIState.current_region_index - 1]).offset().left
    var $ZUIPrevYPosition = $($ZUIState.zui_regions[$ZUIState.current_region_index - 1]).offset().top

    $ZUIState.current_region_index = $ZUIState.current_region_index -= 1
    
    var $ZUISwipeRightStyles = {
      'transform-origin': $ZUIPrevXPosition + 'px ' + $ZUIPrevYPosition + 'px'
    }

    if ( $ZUIState.zoomed_in ) {
      $ZUIBody.css($ZUISwipeRightStyles)
    }
  }

  /*
  |----------------------------------------------------------------------
  | Handle Swiping In General
  |----------------------------------------------------------------------
  */
  var $ZUISwipeHandler = function(event) {
    console.log('Should go to position: ' + $ZUIState.current_region_index)
  }

  /*
  |----------------------------------------------------------------------
  | Handle Zooming Out With Escape Key
  |----------------------------------------------------------------------
  */
  var $ZUIKeyboardHandler = function(event) {
    if (event.keyCode === 27) {
      $ZUIClose.click()
    }
  }

  /*
  |----------------------------------------------------------------------
  | Initializing
  |----------------------------------------------------------------------
  */
  $ZUIDocument.on('ready', $ZUIInitHandler)
  $ZUIWindow.on('hashchange', $ZUIPageStateHandler)
  $ZUIBody.on('keyup', $ZUIKeyboardHandler)

  $ZUIRegion
  .hammer()
  .on('tap', $ZUIZoomInHandler)
  .on('swipe', $ZUISwipeHandler)
  .on('swipeleft', $ZUISwipeLeftHandler)
  .on('swiperight', $ZUISwipeRightHandler)

})