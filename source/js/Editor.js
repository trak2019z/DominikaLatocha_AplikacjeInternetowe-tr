define("Editor", ['jquery', 'fabric', 'EditorFilter', 'b64toBlob'], function($, fabric, EditorFilter, b64toBlob)
{
    "use strict";

    var Editor = function(dom_element, options) {

    	var self = this;

        // class
        self.class   = {
            canvas      : 'js-canvas',
            reset       : 'js-reset',
            download    : 'js-download'
        };

        // element
        self.dom     = $(dom_element);

        self.element = {
            reset       : self.dom.find('.'+self.class.reset),
            download    : self.dom.find('.'+self.class.download)
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

        self.cssMaxWidth    = 637;
        self.cssMaxHeight   = 478;


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

        //Image
        self.photoImage = new EditorFilter(self.dom, self.canvas);

        //Init Image
        fabric.Image.fromURL(self.url, function(img) {
            self.canvasImage = img;

            self.AdjustCanvasDimension();
            self.canvas.add(self.canvasImage).setActiveObject(self.canvasImage);

            self.photoImage.Init(img);
        });

        //Init Edit Options
        self.canvas.on('object:added', function(e){ 
            var object = e.target;
            object.set(self.editOptions);
        });

        //Resize
        // $(window).resize(function() {
        //     console.log('resize');
        //    self.AdjustCanvasDimension();
        // });

        //Reset
        self.element.reset.on('click', function(e){
            e.preventDefault();
            self.Reset();
        });

        //Download
        self.element.download.on('click', function(e){
            e.preventDefault();
            self.Download();
        });


    };

    //Reset Image
    Editor.prototype.Reset = function(){
        var self    = this;

        window.location.reload();
    };

    //Download Image
    Editor.prototype.Download = function(){
        var self    = this,
            file    = 'image.jpeg';

        //Create New Url
        var newUrl  = self.Blob(),
            blob    = newUrl.blob,
            blobUrl = newUrl.blobUrl;

        if (window.navigator.msSaveBlob){
            //IE
            window.navigator.msSaveBlob(blob, file);
        }
        else{
            //Chrome, Mozilla Firefox, Opera
            var a       = document.createElement("a");

            a.download  = file;
            a.href      = blobUrl;

            self.dom.append(a);
            a.click();
            $(a).remove(); 
        }
        
    };

    //Blob Url
    Editor.prototype.Blob = function(){
        var self    = this;

        //Create New Url
        var url     = self.canvas.toDataURL({format: 'jpeg', quality: 1.0 }),
            data    = url.replace('data:image/jpeg;base64,', '');

        var blob    = b64toBlob(data, 'image/jpeg');
        var blobUrl = URL.createObjectURL(blob);

        return {
            url     : url,
            blob    : blob,
            blobUrl : blobUrl
        }
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
            w    = self.cssMaxWidth / width,
            h    = self.cssMaxHeight / height,
            cssMaxWidth  = Math.min(width, self.cssMaxWidth),
            cssMaxHeight = Math.min(height, self.cssMaxHeight);

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