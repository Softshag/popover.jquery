var __slice = [].slice,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function($, window, document) {
  var PopOver, defaults, pluginName;
  if (!$.fn.softshag) {
    $.fn.softshag = {};
  }
  pluginName = "popover";
  defaults = {
    trigger: 'hover',
    content: 'No content',
    attach: 'body',
    position: 'left',
    html: false,
    offsetX: 0,
    offsetY: 0,
    containerClass: 'popover',
    delay: 0,
    showFn: function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = $(this)).fadeIn.apply(_ref, args);
    },
    hideFn: function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = $(this)).fadeOut.apply(_ref, args);
    }
  };
  PopOver = (function() {
    var getPosition;

    PopOver.prototype._timer = null;

    PopOver.prototype.settings = null;

    PopOver.prototype.element = null;

    function PopOver(elm, options) {
      this.destroy = __bind(this.destroy, this);

      this.hide = __bind(this.hide, this);

      this.show = __bind(this.show, this);
      this.settings = $.extend({}, defaults, options);
      this.element = $(elm);
      this.initialize();
    }

    PopOver.prototype.initialize = function() {
      var _this = this;
      this._method = (function() {
        switch (this.settings.trigger) {
          case 'hover':
            return 'mouseenter';
          case 'click':
            return 'click';
        }
      }).call(this);
      this.element.bind(this._method, function() {
        if (_this.settings.delay > 0) {
          if (_this._timer != null) {
            clearTimeout(_this._timer);
          }
          return _this._timer = setTimeout(function() {
            return _this.show();
          }, _this.settings.delay);
        }
        return _this.show();
      });
      if (this._method === 'mouseenter') {
        return this.element.bind('mouseleave', this.hide);
      } else if (this._method === 'click') {
        return $('body').bind('click', this.hide);
      }
    };

    PopOver.prototype.show = function() {
      var content, pos;
      if (this._isOpen) {
        return this.hide();
      }
      content = $.isFunction(this.settings.content) ? this.settings.content.call(null) : this.settings.content;
      this._content = this.settings.html ? $('<div></div>').html(content) : $('<div></div>').text(content);
      this._content.addClass(this.settings.containerClass);
      this._content.css({
        display: 'none'
      }).appendTo(this.settings.attach);
      pos = getPosition(this.element, this.settings.position, this._content, this.settings.offsetX, this.settings.offsetY);
      this._content.css({
        position: 'absolute'
      }).css(pos);
      this._isOpen = true;
      return this.settings.showFn.apply(this._content);
    };

    PopOver.prototype.hide = function() {
      var cb;
      if (this._timer) {
        clearTimeout(this._timer);
        this._timer = null;
      }
      if (!this._isOpen) {
        return;
      }
      this._isOpen = false;
      cb = function() {
        return $(this).remove();
      };
      return this.settings.hideFn.apply(this._content, [cb]);
    };

    PopOver.prototype.destroy = function() {
      if (this._isOpen()) {
        this.hide();
      }
      this.element.unbind(this._method, this.show);
      if (this._method === 'mouseenter') {
        this.element.unbind('mouseleave', this.hide);
      } else if (this._method === 'click') {
        $('body').unbind('click', this.hide);
      }
      return $.removeData(this, "plugin_" + pluginName);
    };

    getPosition = function(element, position, content, offsetX, offsetY) {
      var contentHeight, contentWidth, docHeight, docWidth, elmHeight, elmOffset, elmWidth, pos;
      elmOffset = element.offset();
      elmHeight = element.height();
      elmWidth = element.width();
      contentHeight = content.height();
      contentWidth = content.width();
      docWidth = $(document).width();
      docHeight = $(document).height();
      pos = (function() {
        switch (position) {
          case 'bottom':
            return {
              left: (elmOffset.left - elmWidth) < 0 ? 0 : elmOffset.left - elmWidth,
              top: elmOffset.top + ((elmHeight + contentHeight) / 2) + offsetY
            };
          case 'top':
            return {
              left: (elmOffset.left - elmWidth) < 0 ? 0 : elmOffset.left - elmWidth,
              top: elmOffset.top - contentHeight - offsetY
            };
          case 'right':
            return {
              left: elmOffset.left + (elmWidth + contentWidth) / 2,
              top: elmOffset.top
            };
          case 'left':
            return {
              left: elmOffset.left - contentWidth,
              top: elmOffset.top
            };
        }
      })();
      if (pos.left < 0 && position === 'left') {
        pos.left = elmOffset.left + (elmWidth + contentWidth) / 2;
      }
      if (pos.left > docWidth) {
        pos.left = elmOffset.left - contentWidth;
      }
      if (pos.top < 0) {
        pos.top = elmOffset.top + ((elmHeight + contentHeight) / 2) + offsetY;
      }
      if (pos.top > docHeight) {
        pos.top = elmOffset.top - contentHeight - offsetY;
      }
      return pos;
    };

    return PopOver;

  })();
  return $.fn[pluginName] = function(options, second) {
    return $(this).each(function() {
      var plugin;
      if (!$.data(this, "plugin_" + pluginName)) {
        return $.data(this, "plugin_" + pluginName, new PopOver(this, options));
      } else if ((options != null) && $.isString(options)) {
        plugin = $.data(this, "plugin_" + pluginName);
        if ((plugin[options] != null) && $.isFunction(plugin[options])) {
          return plugin[options].apply(plugin, [second]);
        }
      }
    });
  };
})(jQuery, window, document);
