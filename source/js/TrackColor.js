define("TrackColor", ['jquery'], function($)
{
    "use strict";

    var TrackColor = function() {

        var self = this;

        //Class
        self.class  = {
            track   : 'js-range-track'
        };

        self.track  = {
            default : '#454555',
            active  : '#82399A'
        }   

    };


    //Set Track Color
    TrackColor.prototype.SetTrackColor = function(el){
        var self = this,
            track   = el.parent().find('.'+self.class.track),
            val     = parseInt(el.val()),
            max     = el.attr('max'),
            min     = el.attr('min');

        var value   = (val - min)/(max - min)*100,
            init    = -min/(max - min)*100;

        if (value<init){

            track.css("background", 
                'linear-gradient(' +
                'to right,' +
                self.track.default + ' ' + value + '%,' + 
                self.track.active  + ' ' + value + '%,' + 
                self.track.active  + ' ' + init  + '%,' + 
                self.track.default + ' ' + init  + '% )'
            );
        }
        else{
            track.css("background",
                'linear-gradient(' +
                'to right,' +
                self.track.default + ' ' + init  + '%,' + 
                self.track.active  + ' ' + init  + '%,' + 
                self.track.active  + ' ' + value + '%,' + 
                self.track.default + ' ' + value + '% )'
            );
        }
    }

    return new TrackColor;

});