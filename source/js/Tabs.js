define("Tabs", ['jsb', 'jquery'], function(jsb, $)
{
    "use strict";

    var Tabs = function(dom_element, options) {
        var self = this;

        self.el          = $(dom_element);
        self.linkClass   = '.js-tabs--head';
        self.tabClass    = '.js-tabs--body';

        self.tabAttr     = 'data-tab';
        self.activeClass = 'active';
        
        self.el.on('click', self.linkClass, function(e){
            e.preventDefault();

            var link = $(this),
                tab  = link.attr(self.tabAttr);

            self.Toggle(tab);

        });

        self.el.find(self.linkClass+'.'+self.activeClass).click();
    };

    Tabs.prototype.Toggle = function(v){
        var self = this;

        self.el.find(self.linkClass).removeClass(self.activeClass);
        self.el.find(self.linkClass+'['+self.tabAttr+'="'+v+'"]').addClass(self.activeClass);

        self.el.find(self.tabClass).removeClass(self.activeClass);
        self.el.find(self.tabClass+'['+self.tabAttr+'="'+v+'"]').addClass(self.activeClass);

    }

    return Tabs;

});