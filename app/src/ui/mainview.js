import Menu from './menu.js';
import Page from './page.js';
import RegisterPopup from './membership/registerpopup.js';
import API from "../api.js";

var MainView = React.createClass({
	getInitialState: function() {
        return {
            
        }
    },
    componentDidMount: function(){
        API.signal_registerpopup_show.listen(this.showRegisterPopup);
        API.sigal_loginHeader_update.listen(this.updateLoginHeader);
    },
    componentDidUnMount: function(){
        API.signal_registerpopup_show.unlisten(this.showRegisterPopup); 
        API.sigal_loginHeader_update.unlisten(this.updateLoginHeader);
    },
    updateLoginHeader: function(){
        this.menu.forceUpdate();
    },
    showRegisterPopup: function(){
        this.refs.registerpopup.show();
    },
    render: function() {
    	return (
    		<div>
				<Menu ref='menu'/>
				<Page/>
                <RegisterPopup ref='registerpopup'/>
    		</div>
		);
    }
});

module.exports = MainView;

