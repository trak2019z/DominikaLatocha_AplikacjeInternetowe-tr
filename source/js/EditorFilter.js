define("EditorFilter", ['jquery', 'fabric'], function($, fabric)
{
    "use strict";

    var EditorFilter = function(dom, canvas) {

    	var self = this;

        self.canvas     = canvas;
        self.dom        = dom;

        //class
        self.class   = {
            range       : 'js-range-filter',
            colorBack   : 'js-color-back',
            effect      : 'js-effect'
        };

        // element
        self.element = {
            range       : self.dom.find('.'+self.class.range),
            colorBack   : self.dom.find('.'+self.class.colorBack),
            effect      : self.dom.find('.'+self.class.effect)
        };

    };


    //Init Image
    EditorFilter.prototype.Init = function(img){
        var self = this;

        self.canvasImage = img;
        self.filters     = fabric.Image.filters;

        //Image Filters
        self.element.range.on('mousemove change', function() {
            var el = $(this);
            self.SetFilter(el);
        });

        //Canvas Background
        self.canvas.backgroundColor = self.element.colorBack.val();
        self.element.colorBack.on('color-change', function() {
            var el = $(this);
            self.SetBackgroundColor(el);
        });

        //Image Effects
        self.InitEffects();
        self.element.effect.on('click', function(){
            var el = $(this);
            self.SetEffect(el, false);
        });

    };


    //Image Filters
    EditorFilter.prototype.SetFilter = function(el){
        var self    = this,
            val     = parseInt(el.val()),
            range   = el.data('range'),
            type    = el.attr('type'),
            input   = self.dom.find('[data-range='+range+']');

        if(type !== 'range'){
            val = self.ReturnVal(val, range);
        }

        switch(range){

            case 'brightness':
                self.ApplyFilter(0, new self.filters.Brightness({brightness: val/100}));
                break;

            case 'contrast':
                self.ApplyFilter(1, new self.filters.Contrast({contrast: val/100}));
                break;

            case 'saturation':
                self.ApplyFilter(2, new self.filters.Saturation({saturation: val/100}));
                break;

            case 'blur':
                self.ApplyFilter(3, new self.filters.Blur({blur: val/500}));
                break;

            case 'hue':
                self.ApplyFilter(4, new self.filters.HueRotation({rotation: val/100}));
                break;
        }

        input.val(val);
    };


    //Image Apply FIlter
    EditorFilter.prototype.ApplyFilter = function(index, filter){
        var self = this;

        self.canvasImage.filters[index] = filter;
        self.canvasImage.applyFilters();
        self.canvas.requestRenderAll();
    };


    //Check Val Input Range
    EditorFilter.prototype.ReturnVal = function(val, range){
        var self = this,
            el   = self.dom.find('[data-range='+range+'][type="range"]'),
            max  = el.attr('max'),
            min  = el.attr('min');

        if(val >= max){ val = max; }
        else if(val <= min){ val = min; }

        return val;
    };


    //Set Background Color
    EditorFilter.prototype.SetBackgroundColor = function(el){
        var self    = this,
            val     = el.val();

        self.canvas.backgroundColor = val;
        self.canvas.requestRenderAll();
    };


    //Image Init Effects
    EditorFilter.prototype.InitEffects = function(){
        var self = this, temp = 0;

        self.element.effect.each(function(){
            var el = $(this);
            self.SetEffect(el, true);
        });
    };

    //Image Set Effect
    EditorFilter.prototype.SetEffect = function(el, init){
        var self    = this, n,
            attr    = el.attr('data-effect'),
            active  = el.hasClass('active');

        if(!init){
            (active)? el.removeClass('active') : el.addClass('active');
            active = !active;
        }

        switch(attr){

            case 'sepia':
                n = 5;
                self.ApplyFilter(n, (active || init) && new self.filters.Sepia());
                break;

            case 'brownie':
                n = 6;
                self.ApplyFilter(n, (active || init) && new self.filters.Brownie());
                break;

            case 'grayscale':
                n = 7;
                self.ApplyFilter(n, (active || init) && new self.filters.Grayscale());
                break;

            case 'vintage':
                n = 8;
                self.ApplyFilter(n, (active || init) && new self.filters.Vintage());
                break;

            case 'technicolor':
                n = 9;
                self.ApplyFilter(n, (active || init) && new self.filters.Technicolor());
                break;

            case 'polaroid':
                n = 10;
                self.ApplyFilter(n, (active || init) && new self.filters.Polaroid());
                break;

            case 'kodachrome':
                n = 11;
                self.ApplyFilter(n, (active || init) && new self.filters.Kodachrome());
                break;

            case 'sharpen':
                n = 12;
                self.ApplyFilter(n, (active || init) && new self.filters.Convolute({
                  matrix: [  0, -1,  0,
                            -1,  5, -1,
                             0, -1,  0 ]
                }));
                break;

        }

        var url = self.canvas.toDataURL({format: 'jpeg', quality: 0.5 });
        if(init) el.css('background-image', 'url('+url+')');

        if((active === false)){
            self.ApplyFilter(n, false);
        }
    };

    return EditorFilter;

});