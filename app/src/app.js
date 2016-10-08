import MainView from './ui/mainview.js';
import API from './api.js';


window.Promise = require('es6-promise').Promise;


(function($){
    $.isBlank = function(obj){
        if (!obj || $.trim(obj) === "") return true;
        if (obj.length && obj.length > 0) return false;
        for (var prop in obj) if (obj[prop]) return false;
        return true;
    };

    /*
    * trigger event in capture phase.
    * jQuery only supports the event bubbling phase
    * */
    $.capture = function(el, type, handler){
        if ( el[0].addEventListener ) {
            el[0].removeEventListener( type, handler, true );
            el[0].addEventListener( type, handler, true );
        } else {
            el[0].detachEvent( type, handler);
            el[0].attachEvent( type, handler);
        }
    }
    $.unbindcapture = function(el, type, handler){
        if ( el[0].addEventListener ) {
            el[0].removeEventListener( type, handler, true );
        } else {
            el[0].detachEvent( type, handler);
        }
    }
})(jQuery);

(function() {
   (function bindWindowResizeEvent(signal){
        var rtime;
        var timeout = false;
        var delta = 200;
        $(window).resize(function (event) {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(function(){
                    resizeend(event);
                }, delta);
            }
        });

        var resizeend = function(event) {
            if (new Date() - rtime < delta) {
                setTimeout(function(){
                    resizeend(event);
                }, delta);
            } else {
                timeout = false;
                signal.dispatch();
            }
        };
    })(API.sigal_window_resizeend)


    
    API.initLoginStatus().then(function(){
        ReactDOM.render(<MainView/>, $("#domContainer")[0]);    
    })


 
    
})();