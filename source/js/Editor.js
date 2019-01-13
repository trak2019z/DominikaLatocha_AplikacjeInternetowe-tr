define("Editor", ['jquery', 'fabric', 'EditorFilter', 'EditorText', 'EditorBrush', 'b64toBlob'], function($, fabric, EditorFilter, EditorText, EditorBrush, b64toBlob)
{
    "use strict";

    var Editor = function(dom_element, options) {

    	var self = this;

        // class
        self.class   = {
            canvas      : 'js-canvas',
            reset       : 'js-reset',
            download    : 'js-download',
            file        : 'js-file'
        };

        // element
        self.dom     = $(dom_element);

        self.element = {
            download    : self.dom.find('.'+self.class.download),
            file        : self.dom.find('.'+self.class.file)
        };

        //self.url            = options.url;
        self.enterText      = options.enterText;
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
        self.editorFilter = new EditorFilter(self.dom, self.canvas);

        //Text
        self.editorText = new EditorText(self.dom, self.enterText, self.canvas);

        //Brush
        self.editorBrush = new EditorBrush(self.dom, self.canvas);


        self.element.file.on('change', function(){
            var el = $(this);
            self.GetImage(el);
        });
    };

    Editor.prototype.GetImage = function(el){
        var self = this;

        if (el[0].files && el[0].files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var blob = self.Blob(e.target.result);

                self.url = blob.blobUrl;
                self.element.file.remove();

                self.InitImage();
            };
            
            reader.readAsDataURL(el[0].files[0]);
        }
    };

    Editor.prototype.InitImage = function(){
        var self = this;
        
        //Init Image
        fabric.Image.fromURL(self.url, function(img) {
            self.canvasImage = img;

            self.AdjustCanvasDimension();
            self.canvas.add(self.canvasImage).setActiveObject(self.canvasImage);

            self.canvasImage.id = 0;

            self.editorFilter.Init(img);
        });

        //Init Edit Options
        self.canvas.on('object:added', function(e){ 
            var object = e.target;
            object.set(self.editOptions);
        });

        //Download
        self.element.download.on('click', function(e){
            e.preventDefault();
            self.Download();
        });

        //Delete Active Object
        $('html').keyup(function(e){
            self.Delete(e);
        });

        //Init Tab Content
        $('body').on('tab-change', function(e, tab){
            (tab !== "brush")?
            self.editorBrush.BrushOff() :
            self.editorBrush.SetBrush();
        });


    };

    //Delete Active Object
    Editor.prototype.Delete = function(e){
        var self    = this;

        if(e.keyCode == 46) {
            var active = self.canvas.getActiveObject();
            if(active.id === undefined){
                self.canvas.remove(active);
                self.EditorText.ClearActiveText();
            } 
        }
    };

    //Download Image
    Editor.prototype.Download = function(){
        var self    = this,
            file    = 'image.jpeg';

        //Create New Url
        var url = self.canvas.toDataURL({format: 'jpeg', quality: 1.0 });

        var newUrl  = self.Blob(url),
            blob    = newUrl.blob,
            blobUrl = newUrl.blobUrl;
            console.log(blob);

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
    Editor.prototype.Blob = function(url){
        var self    = this;

        //Create New Url
        var data    = url.replace('data:image/jpeg;base64,', '');

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