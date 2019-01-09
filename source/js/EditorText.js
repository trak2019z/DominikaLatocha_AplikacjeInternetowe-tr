define("EditorText", ['jquery','fabric'], function($, fabric)
{
    "use strict";

    var EditorText = function(dom, enterText, canvas) {

    	var self = this;

        self.canvas     = canvas;
        self.dom        = dom;
        self.enterText  = enterText;

        // class
        self.class   = {
            btnText     : 'js-btn-text',
            rangeSize   : 'js-range-size',
            font        : 'js-font',
            fontHidden  : 'js-font-hidden',
            textColor   : 'js-text-color-item',
            textColorP  : 'js-text-color',
            active      : 'active'
        };

        // element
        self.element = {
            btnText     : self.dom.find('.'+self.class.btnText),
            rangeSize   : self.dom.find('.'+self.class.rangeSize),
            font        : self.dom.find('.'+self.class.font),
            fontHidden  : self.dom.find('.'+self.class.fontHidden),
            textColor   : self.dom.find('.'+self.class.textColor),
            textColorP  : self.dom.find('.'+self.class.textColorP)
        };

        self.activeText     = '';
        self.activeTextColor= '';

        self.Init();
    };

    EditorText.prototype.Init = function(){
        var self = this;

        //Init Textbox
        self.element.btnText.on('click', function(){
            self.AddText();
        });

        //Text Color
        self.element.textColor.on('click', function(){
            var el = $(this);
            self.activeTextColor = el;
            self.SetColor(el);
        });

        self.element.textColorP.on('color-change', function(){
            var el = $(this);
            self.element.textColor.removeClass(self.class.active);
            self.activeTextColor = '';
            self.SetColor(el);
        });

        //Text Size
        self.element.rangeSize.on('mousemove change', function(){
            var el = $(this);
            self.SetSize(el);
        });

        //Text Font 
        self.element.font.on('select2:select', function(){
            if (self.activeText !== ''){
                var val = self.element.font.val();
                self.SetFont(val);
            }
        });

        //Set Active Text
        self.canvas.on('mouse:down', function(e){ 
            if(e.target){ 
                var type = e.target.get('type');
 
                if(type === 'textbox'){
                    self.activeText = e.target;
                    self.GetText();
                }
                else{
                    self.ClearActiveText();
                }
            }
        });
    };

    //Clear Active Text
    EditorText.prototype.ClearActiveText = function(){
        var self = this;
        self.activeText = '';
    }

    //Add Text
    EditorText.prototype.AddText = function(){
        var self = this,
            text = new fabric.Textbox(self.enterText);

        self.activeText = text;
        self.element.fontHidden.css('font-family', self.element.font.val());

        //Text Color
        self.element.textColor.each(function(){
            var el = $(this);

            if(el.hasClass(self.class.active)){
                self.activeTextColor = el;
            }
        });

        (self.activeTextColor !== '')? 
        self.SetColor(self.activeTextColor) : 
        self.SetColor(self.element.textColorP);

        //Font Size
        self.activeText.set("fontSize", self.element.rangeSize.val());

        setTimeout(function(){

            //Font Family
            self.activeText.set("fontFamily", self.element.font.val());

            self.canvas.add(text).setActiveObject(text);
            self.canvas.centerObject(text).requestRenderAll();
        },300);

    };

    //Get Text
    EditorText.prototype.GetText = function(){
        var self = this;

        self.element.rangeSize.val(self.activeText.fontSize);
        self.element.font.val(self.activeText.fontFamily).trigger('change');
        self.GetColor();
    };

    //Text Size
    EditorText.prototype.SetSize = function(el){
        var self = this,
            val     = el.val(),
            range   = el.data('range'),
            type    = el.attr('type');

        if(type !== 'range'){
            val = self.ReturnVal(val, range);
        }

        self.element.rangeSize.val(val);

        if (self.activeText !== ''){
            self.activeText.set("fontSize", val);
            self.canvas.requestRenderAll();
        }
    };

    //Text Font
    EditorText.prototype.SetFont = function(val){
        var self = this;

        self.element.fontHidden.css('font-family', val);

        setTimeout(function(){
            self.activeText.set("fontFamily", val);
            self.canvas.requestRenderAll();
        },300);
    };

    //Text Set Color
    EditorText.prototype.SetColor = function(el){
        var self = this,
            val;

        self.element.textColor.removeClass(self.class.active);
        self.element.textColorP.removeClass(self.class.active);
        el.addClass(self.class.active);

        (self.activeTextColor !== '')? val = el.data("color") : val = el.val();

        if(val !== undefined && self.activeText !== ''){
            self.activeText.setColor(val);
            self.canvas.requestRenderAll();
        }
    };

    //Text Get Color
    EditorText.prototype.GetColor = function(){
        var self = this;

        self.element.textColor.removeClass(self.class.active);
        self.element.textColorP.removeClass(self.class.active);
        self.activeTextColor = '';

        self.element.textColor.each(function(){
            var el = $(this),
                color = el.data("color");

            if(color === self.activeText.fill){
                el.addClass(self.class.active);
                self.activeTextColor = el;
            }
        });

        if(self.activeTextColor === ''){
            self.element.textColorP.val(self.activeText.fill);
            self.element.textColorP.addClass(self.class.active);
        }
    };

    //Check Val Input Range
    EditorText.prototype.ReturnVal = function(val, range){
        var self = this,
            el   = self.dom.find('[data-range='+range+'][type="range"]'),
            max  = el.attr('max'),
            min  = el.attr('min'),
            val  = parseInt(val, 10);

        if(val >= max){ val = max; }
        else if(val <= min){ val = min; }

        return val;
    };

    return EditorText;

});