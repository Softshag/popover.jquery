
# jQuery.Popover
# https://github.com/rasmus/jQuery.Popover
#
# Copyright (c) 2013 Rasmus Kildevæld
# Licensed under the MIT license.

;( ($, window, document) ->
	pluginName = "popover"

	defaults = 
		trigger: 'hover'
		content: 'No content'
		attach: 'body'
		position: 'left'
		html: no
		offsetX: 0
		offsetY: 0
		containerClass: 'popover'
		delay: 0
		showFn: (args...) -> $(@).fadeIn args...
		hideFn: (args...) -> $(@).fadeOut args...

	class PopOver
		_timer: null
		settings: null
		element: null
		constructor: (elm, options) ->
			@settings = $.extend {}, defaults, options
			@element = $ elm

			@initialize()

		initialize : ->

			@_method = switch @settings.trigger
				when 'hover' then 'mouseenter'
				when 'click' then 'click'

			@element.bind @_method, => 
				if @settings.delay > 0
					clearTimeout @_timer if @_timer?
					return @_timer = setTimeout =>
						@show()
					, @settings.delay
				@show()
				
			if @_method is 'mouseenter'
				@element.bind 'mouseleave', @hide
			else if @_method is 'click'
				$('body').bind 'click', @hide

		show: =>
			return @hide() if @_isOpen

			content = if $.isFunction(@settings.content) then @settings.content.call(null) else @settings.content

			@_content = if @settings.html then $('<div></div>').html content else $('<div></div>').text content

			@_content.addClass @settings.containerClass

			@_content.css(display:'none').appendTo @settings.attach
			
			pos = getPosition @element, @settings.position, @_content, @settings.offsetX, @settings.offsetY
			
			@_content.css(position:'absolute').css(pos)
			
			@_isOpen = yes
			
			@settings.showFn.apply @_content

		hide: =>
			if @_timer
				clearTimeout @_timer
				@_timer = null
			return unless @_isOpen
			@_isOpen = no
			
			cb = -> $(@).remove()
			@settings.hideFn.apply @_content, [cb]
		destroy: =>
			@hide() if @_isOpen()
			@element.unbind @_method, @show
			if @_method is 'mouseenter'
				@element.unbind 'mouseleave', @hide
			else if @_method is 'click'
				$('body').unbind 'click', @hide
			$.removeData @, "plugin_#{pluginName}"


		getPosition = (element, position, content,offsetX,offsetY) ->
			elmOffset = element.offset()
			elmHeight = element.height()
			elmWidth = element.width()
			contentHeight = content.height()
			contentWidth = content.width()
			
			docWidth = $(document).width()
			docHeight = $(document).height()

			pos = switch position
				when 'bottom' 
					left: if (elmOffset.left - elmWidth) < 0 then 0 else elmOffset.left - elmWidth
					top: elmOffset.top + ((elmHeight + contentHeight)/2) + offsetY	
				when 'top'
					left: if (elmOffset.left - elmWidth) < 0 then 0 else elmOffset.left - elmWidth
					top: elmOffset.top - (contentHeight) - offsetY
				when 'right'
					left: elmOffset.left + (elmWidth+contentWidth)/2
					top: elmOffset.top
				when 'left'
					left: elmOffset.left - (contentWidth)
					top: elmOffset.top
			
			if pos.left < 0 and position is 'left'
				pos.left = elmOffset.left + (elmWidth+contentWidth)/2
			if pos.left > docWidth
				pos.left = elmOffset.left - (contentWidth)
			if pos.top < 0
				pos.top = elmOffset.top + ((elmHeight + contentHeight)/2) + offsetY
			if pos.top > docHeight
				pos.top = elmOffset.top - (contentHeight) - offsetY
			return pos


	$.fn[pluginName] = (options,second) ->
		$(@).each ->
			if !$.data(@, "plugin_#{pluginName}")
				$.data @, "plugin_#{pluginName}", new PopOver @, options
			else if options? and $.isString options
				plugin = $.data(@, "plugin_#{pluginName}")
				if plugin[options]? and $.isFunction plugin[options]
					plugin[options].apply(plugin,[second])

) jQuery, window, document