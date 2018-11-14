define("Custom", ['jquery', 'ColorPicker', 'select2', 'CustomScroll', 'TrackColor'], function($, ColorPicker, select2, CustomScroll, TrackColor)
{
    "use strict";

    var Custom = function(el) {

        var self = this;

        //Class
        self.class   = {
            select        : 'js-select',
            range         : 'js-range',
            rangeText     : 'js-range-text',
            colorPicker   : 'js-color-picker',
            selectOptions : 'select2-results__options'
        };

        //Element
        self.el = el;
        self.element = {
            select        : self.el.find('.'+self.class.select), 
            range         : self.el.find('.'+self.class.range),
            rangeText     : self.el.find('.'+self.class.rangeText),
            colorPicker   : self.el.find('.'+self.class.colorPicker)
        };

        self.Init();
    };


    Custom.prototype.Init = function(){
        var self = this;

        //Init Select
        self.element.select.each(function(){
            var el = $(this);
            el.select2({
                minimumResultsForSearch : Infinity
            });

            //Select Scroll
            el.on('select2:open', function(e){
                var list = $('.'+self.class.selectOptions);
                new CustomScroll(list, {});
            });
        });

        //Init Input Range
        self.element.range.each(function() {
            var el = $(this);
            TrackColor.SetTrackColor(el);
        });

        //Set Input Range
        self.element.range.on('mousemove change', function() {
            var el   = $(this);
            self.SetInputRange(el);
        });

        //Set Input Range Text
        self.element.rangeText.on('change', function() {
            var el   = $(this);
            self.SetInputRangeText(el);
        });

        //Init Color Picker
        self.element.colorPicker.each(function(){
            var el  = $(this);
            self.SetColorPicker(el);
        });  
    };


    //Set Input Range
    Custom.prototype.SetInputRange = function(el){
        var self = this,
            val  = parseInt(el.val()),
            text = el.parent().find('.'+self.class.rangeText);

        text.val(val);
        TrackColor.SetTrackColor(el);
    };


    //Set Input Range Text
    Custom.prototype.SetInputRangeText = function(el){
        var self = this,
            val  = parseInt(el.val()),
            range= el.data('range'),
            input= self.el.find('.'+self.class.range+'[data-range='+range+']');

        val = self.ReturnVal(input, val);

        el.val(val);
        input.val(val);

        TrackColor.SetTrackColor(input);
    };


    //Set Color Picker
    Custom.prototype.SetColorPicker = function(el){
        var self    = this;

        el.colorPicker({
            opacity         : false,
            animationSpeed  : 0,
            dark            : '#000000',
            light           : '#FFFFFF'
        });  
    };


    //Check Val Input Range
    Custom.prototype.ReturnVal = function(input, val){
        var self = this,
            max  = input.attr('max'),
            min  = input.attr('min');

        if(val >= max){ val = max; }
        else if(val <= min){ val = min; }

        return val;
    };

    return Custom;

});