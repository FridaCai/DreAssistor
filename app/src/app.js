import MainView from './ui/mainview.js';
import PolyFill from './lib/polyfill.js';


PolyFill.execute();

if(Promise != undefined){
  window.Promise = require('es6-promise').Promise;
}

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
	ReactDOM.render(<MainView/>, $("#domContainer")[0]);
})();


