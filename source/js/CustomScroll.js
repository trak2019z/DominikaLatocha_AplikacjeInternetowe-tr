define("CustomScroll", ['jquery', 'Detect', 'nicescroll'], function($, Detect, Nicescroll)
{
    "use strict";

    var CustomScroll = function(dom_element, options) {

        var self = this;

        self.el = $(dom_element);

        if(!Detect.isMobile()){
            self.el.perfectScrollbar();

            $(window).resize(function(){
                self.el.perfectScrollbar('update');
            });
        }

    };

    return CustomScroll;

});