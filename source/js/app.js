define('app', ['jsb', 'jquery', 'Custom'], function(jsb, $, Custom)
{

    var App = function(){
    	jsb.applyBehaviour(document.body);

        var c = new Custom($('body'));
    }

    return new App();
});