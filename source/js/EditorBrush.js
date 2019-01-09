define("EditorBrush", ['jquery','fabric'], function($, fabric)
{
    "use strict";

    var EditorBrush = function(dom, canvas) {

    	var self = this;

        self.canvas = canvas;
        self.dom    = dom;

        //class
        self.class   = {
            brush       : 'js-brush',
            range       : 'js-range-brush',
            brushColor  : 'js-brush-color',
            shadowColor : 'js-shadow-color',
            active      : 'active'
        };

        // element
        self.element = {
            brush       : self.dom.find('.'+self.class.brush),
            range       : self.dom.find('.'+self.class.range),
            brushColor  : self.dom.find('.'+self.class.brushColor),
            shadowColor : self.dom.find('.'+self.class.shadowColor)
        };

        self.Init();

    };

    EditorBrush.prototype.Init = function(){
        var self = this;

        //Set Brush
        self.element.brush.on('select2:select', function(){
            var el = $(this);
            self.SetBrush(el);
        });

        //Brush Color
        self.element.brushColor.on('color-change', function() {
            var el  = $(this);
            if(self.canvas.isDrawingMode){
                self.canvas.freeDrawingBrush.color = el.val();
            }
        });

        //Shadow Color
        self.element.shadowColor.on('color-change', function() {
            var el  = $(this);
            if(self.canvas.isDrawingMode){
                self.canvas.freeDrawingBrush.shadow.color = el.val();
            }
        });

        //Set Param 
        self.element.range.on('mousemove change', function() {
            var el  = $(this);
            self.SetParam(el);
        });

    };

    EditorBrush.prototype.SetBrush = function(){
        var self  = this,
            brush = self.element.brush.val();

        self.canvas.isDrawingMode = true;
        self.InitBrush(brush);
    };

    EditorBrush.prototype.BrushOff = function(){
        var self = this;
        self.canvas.isDrawingMode = false;
    };

    EditorBrush.prototype.InitBrush = function(brush){
        var self    = this,
            bColor  = self.element.brushColor.val(),
            sColor  = self.element.shadowColor.val();

        //Brush Type
        self.canvas.freeDrawingBrush = new fabric[brush + 'Brush'](self.canvas);
        if(brush === 'Spray') self.canvas.freeDrawingBrush.dotWidth = 2;
        
        //Brush Color
        self.canvas.freeDrawingBrush.color = bColor;

        //Brush SHadow
        self.canvas.freeDrawingBrush.shadow = new fabric.Shadow({
            affectStroke: true,
            color: sColor
        });

        //Brush Param 
        self.element.range.each(function() {
            var el  = $(this);
            self.SetParam(el);
        });
    };

    EditorBrush.prototype.SetParam = function(el){
        var self = this,
            val     = parseInt(el.val()),
            range   = el.data('range'),
            type    = el.attr('type'),
            input   = self.dom.find('[data-range='+range+']');

        if(type !== 'range'){
            val = self.ReturnVal(val, range);
        }

        if(self.canvas.isDrawingMode){
            switch(range){

                case 'brush-size':
                    self.canvas.freeDrawingBrush.width = val;
                    break;
                case 'shadow-size':
                    self.canvas.freeDrawingBrush.shadow.blur = val;
                    break;
                case 'shadow-length':
                    self.canvas.freeDrawingBrush.shadow.offsetX = val;
                    self.canvas.freeDrawingBrush.shadow.offsetY = val;
                    break;
            }
        }

        input.val(val);
    }

    //Check Val Input Range
    EditorBrush.prototype.ReturnVal = function(val, range){
        var self = this,
            el   = self.dom.find('[data-range='+range+'][type="range"]'),
            max  = parseInt(el.attr('max'), 10),
            min  = parseInt(el.attr('min'), 10);

        if(val >= max){ val = max; }
        else if(val <= min){ val = min; }

        return val;
    };

    return EditorBrush;

});