/*!
 *
 * =======================================================================
 *  THE SIMPLEST JAVASCRIPT CUSTOM RANGE SLIDER
 *  Author: Taufik Nurrohman <https://github.com/tovic>
 * =======================================================================
 *
 * This is free and unencumbered software released into the public domain.
 *
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any means.
 *
 * In jurisdictions that recognize copyright laws, the author or authors
 * of this software dedicate any and all copyright interest in the
 * software to the public domain. We make this dedication for the benefit
 * of the public at large and to the detriment of our heirs and
 * successors. We intend this dedication to be an overt act of
 * relinquishment in perpetuity of all present and future rights to this
 * software under copyright law.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * For more information, please refer to <http://unlicense.org>
 *
 */

function rangeSlider(elem, config) {

  var html = document.documentElement,
    range = document.createElement('div'),
    dragger = document.createElement('span'),
    down = true,
    rangeWidth = 0,
    rangeOffset = 0,
    draggerWidth = 0,
    cachePosition = 0;

  var defaults = {
    value: 0, // set default value on initiation from `0` to `100` (percentage based)
    vertical: false, // vertical or horizontal?
    rangeClass: "", // add extra custom class for the range slider track
    draggerClass: "", // add extra custom class for the range slider dragger
    drag: function(v) { /* console.log(v); */ } // function to return the range slider value into something
  };

  for (var i in defaults) {
    if (typeof config[i] == "undefined") config[i] = defaults[i];
  }

  function getPos(el) {
    var left = 0,
      top = 0;
    if (el.offsetParent) {
      do {
        left += el.offsetLeft;
        top += el.offsetTop;
      } while (el = el.offsetParent);
    } else {
      left = el.offsetLeft;
      top = el.offsetTop;
    }
    return [left, top];
  }

  function addEventTo(el, ev, fn) {
    if (el.addEventListener) {
      var evts = ev.split(' ');
      for (var i = 0, iLen = evts.length; i < iLen; i++) {
        el.addEventListener(evts[i], fn, false);
      }

    } else if (el.attachEvent) {
      el.attachEvent('on' + ev, fn);
    } else {
      el['on' + ev] = fn;
    }
  }
  var isVertical = config.vertical;

  elem.className = (elem.className + ' range-slider range-slider-' + (
    isVertical ? 'vertical' : 'horizontal')).replace(/^ +/, "");
  range.className = ('range-slider-track ' + config.rangeClass).replace(/ +$/,
    "");
  dragger.className = ('dragger ' + config.draggerClass).replace(/ +$/, "");

  addEventTo(range, "mousedown touchstart", function(e) {
    html.className = (html.className + ' no-select').replace(/^ +/, "");
    rangeWidth = range[!isVertical ? 'offsetWidth' : 'offsetHeight'];
    rangeOffset = getPos(range)[!isVertical ? 0 : 1];
    draggerWidth = dragger[!isVertical ? 'offsetWidth' : 'offsetHeight'];
    down = true;
    updateDragger(e);
    return false;
  });

  addEventTo(document, "mousemove touchmove", function(e) {
    updateDragger(e);
  });

  addEventTo(document, "mouseup touchend", function(e) {
    html.className = html.className.replace(/(^| )no-select( |$)/g, "");
    down = false;
  });

  addEventTo(window, "resize", function(e) {
    var woh = dragger[!isVertical ? 'offsetWidth' : 'offsetHeight'];
    dragger.style[!isVertical ? 'left' : 'top'] = (((cachePosition / 100) *
        range[!isVertical ? 'offsetWidth' : 'offsetHeight']) - (woh / 2)) +
      'px';
    down = false;
  });

  function updateDragger(e) {
    e.preventDefault();
    e.stopPropagation();
    e = e || window.event;
    //check if event was touch
    //console.log(e.touches);
    if (e.touches) {
      var currentX = e.changedTouches[0].pageX;
      var currentY = e.changedTouches[0].pageY;
      // console.log(currentX, currentY);

    } else {
      var currentX = e.pageX;
      var currentY = e.pageY;
      // console.log(currentX, currentY);
    }
    var pos = !isVertical ? currentX : currentY;
    if (!pos) {
      pos = !isVertical ? currentX + document.body.scrollLeft + document.documentElement
        .scrollLeft : currentY + document.body.scrollTop + document.documentElement
        .scrollTop;
    }
    if (down && pos >= rangeOffset && pos <= (rangeOffset + rangeWidth)) {
      dragger.style[!isVertical ? 'left' : 'top'] = (pos - rangeOffset - (
        draggerWidth / 2)) + 'px';
      cachePosition = Math.round(((pos - rangeOffset) / rangeWidth) * 100);
      config.drag(cachePosition, e);
    }
  }

  function initDragger() {
    var woh = dragger[!isVertical ? 'offsetWidth' : 'offsetHeight'];
    cachePosition = ((config.value / 100) * range[!isVertical ? 'offsetWidth' :
      'offsetHeight']);
    dragger.style[!isVertical ? 'left' : 'top'] = (cachePosition - (woh / 2)) +
      'px';
    config.drag(config.value);
  }

  range.appendChild(dragger);
  elem.appendChild(range);

  initDragger();

}
