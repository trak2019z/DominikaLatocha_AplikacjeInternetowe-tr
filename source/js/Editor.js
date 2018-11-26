define("Editor", ['jquery', 'fabric'], function($, fabric)
{
    "use strict";

    var Editor = function(dom_element, options) {

    	var self = this;

        // class
        self.class   = {
            canvas      : 'js-canvas'
        };

        // element
        self.dom     = $(dom_element);
        self.element = {
            
        };

        self.url            = options.url;
        self.canvasImage    = '';

        self.editOptions    = {
            transparentCorners  : false,
            cornerColor         : '#006CFF',
            borderColor         : '#006CFF',
            rotatingPointOffset : 100,
            cornerSize          : 16
        };


        self.Init(); 

    };

    Editor.prototype.Init = function(){
        var self = this;

        //Canvas
        self.canvas = new fabric.Canvas(
            self.class.canvas, 
            { 
                //keep the image at the back of the canvas (disable jumps to the top when I select main image)
                preserveObjectStacking:true 
            }
        );

        //Init Image
        fabric.Image.fromURL(self.url, function(img) {
            self.canvasImage = img;

            self.AdjustCanvasDimension();
            self.canvas.add(self.canvasImage).setActiveObject(self.canvasImage);
        });

        //Init Edit Options
        self.canvas.on('object:added', function(e){ 
            var object = e.target;
            object.set(self.editOptions);
        });

        //Resize
        $(window).resize(function() {
           self.AdjustCanvasDimension();
        });

    };

    //Image Dimension
    Editor.prototype.AdjustCanvasDimension = function () {
        var self        = this,
            canvasImage = self.canvasImage.scale(1),
            bound       = canvasImage.getBoundingRect(),
            width       = bound.width,
            height      = bound.height,
            maxDimension= self.CalcMaxDimension(width, height);

        self.canvas.setDimensions({
            width   : '100%',
            height  : '100%', 
            'max-width' : maxDimension.width + 'px',
            'max-height': maxDimension.height + 'px'
        }, {cssOnly : true});

        self.canvas.setDimensions({
            width   : width,
            height  : height
        }, {backstoreOnly : true});

        self.canvasImage = canvasImage;
        self.canvas.centerObject(self.canvasImage);
    };

    Editor.prototype.CalcMaxDimension = function(width, height) {
        var self = this,
            //padding: 16px;
            maxW = self.dom.width() -32,
            maxH = self.dom.height() -32,
            w    = maxW / width,
            h    = maxH / height,
            cssMaxWidth  = Math.min(width, maxW),
            cssMaxHeight = Math.min(height, maxH);

        if (w < 1 && w < h) {
            cssMaxWidth  = width * w;
            cssMaxHeight = height * w;
        } else if (h < 1 && h < w) {
            cssMaxWidth  = width * h;
            cssMaxHeight = height * h;
        }

        return {
            width   : Math.floor(cssMaxWidth),
            height  : Math.floor(cssMaxHeight)
        };
    };

    return Editor;

});