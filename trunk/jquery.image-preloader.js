/*
	version 1.5, fixed cache issue
*/
(function( $ ){

  $.fn.preloadImages = function( options ) {
  	
  	/**
			Default options wich are called when options is not provided
  	*/
		var settings = {
			/**
				This callback is called at the beginning of the
				preload process, before swapping rel and src attributes
				The default one does notthing.
			*/
			init: function(){
				return true;
			},
			
			/**
				This callback is called when all images are loaded.
				If you want to cycle when all images are loaded 
				you have to call .cycle() here
			*/
			imagesLoaded : function(){
				var that = $(this);
				that.find('.image_system').fadeOut('fast',function(){
					that.find('div.preload').fadeIn('fast',function(){
					});
				});
			},
	
			/**
				This callback is called at the beginning of the preloading 
				process and everytime a single image is fully loaded.
				The default one updates the current counter
			*/
			updateCounter : function(currentImage,numberOfImages){
				var that = $(this);
				var counter = {
					status 				: that.find('.image_system .status'),
					status_glue 	: ' / ',
					count 				: that.find('.image_system .count'),
					total 				: that.find('.image_system .total')
				};
				if(counter.status && counter.status_glue && currentImage && numberOfImages)	
					counter.status.html(currentImage+counter.status_glue+numberOfImages);
				if(counter.count && currentImage)		
					counter.count.html(currentImage); 
				if(counter.total && numberOfImages)		
					counter.total.html(numberOfImages);
			},
			
			/**
				This callback is called everytime a single image is fully loaded
				The default one does notthing
				@param currentImage the numbero of the image loaded
				@param numberOfImages the total numbero of images
			*/
			singleImageLoaded : function(currentImage,numberOfImages){
				return true;
			},
			
			/**
				The selector of images to be preloaded, default is '.preload'
			*/
			imageSelector:'.preload'
    };
  	
  	return this.each(function(){ 
  	  
      if ( options ) {
        $.extend( settings, options );
      }
			
			var that = $(this);
			var images = that.find('img'+settings.imageSelector);
			var numberOfImages = images.length;
			var currentImage = 0;
			
			if(jQuery.isFunction(settings.init)){
				settings.init.call(that);
			}
			
			if(jQuery.isFunction(settings.updateCounter)){
				settings.updateCounter.call(that,currentImage,numberOfImages);
			}
			
			// It's possible, with caching, that the images could
			//  be loaded *before* this code runs.  So:
			var is_image_loaded = function(img) {
					// IE
					if(!img.complete) {
							return false;
					}
					// Others
					if(typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) {
							return false;
					}
					return true;
			};

			images.each(function(){
				$(this).attr('src',$(this).attr('rel'));
				// cached images don't fire load sometimes, so we reset src.
				if (this.complete || this.complete === undefined){
					var src = this.src;
					// webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
					// data uri bypasses webkit log warning (thx doug jones)
					this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
					this.src = src;
				}
				
				$(this).load(function(e){
					currentImage++;
					if(jQuery.isFunction(settings.updateCounter))
						settings.updateCounter.call(that,currentImage,numberOfImages);
					if(jQuery.isFunction(settings.singleImageLoaded))
						settings.singleImageLoaded.call(that,currentImage,numberOfImages);
					if(currentImage==numberOfImages) 
						if(jQuery.isFunction(settings.imagesLoaded)) 
							settings.imagesLoaded.call(that);
				});
			});
			
    });// end of each
  };// end of  $.fn.preloadImages
})( jQuery );