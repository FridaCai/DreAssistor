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
        API.sigal_login.listen(this.onLogin);
        API.sigal_logout.listen(this.onLogout);
    },

    componentWillUnmount: function(){
        API.signal_registerpopup_show.unlisten(this.showRegisterPopup); 
        API.sigal_login.unlisten(this.onLogin);
        API.sigal_logout.unlisten(this.onLogout);
    },
    onLogin: function(){
        this.refs.menu.forceUpdate();
    },
    onLogout: function(){
        this.refs.menu.forceUpdate();
    },

    showRegisterPopup: function(){
        ReactDOM.unmountComponentAtNode(this.refs.popup);    
        ReactDOM.render(<RegisterPopup/>, this.refs.popup);  
    },
    render: function() {
    	return (
    		<div>
				<Menu ref='menu'/>
				<Page ref='page'/>
                <div ref='popup'/>
    		</div>
		);
    }
});

module.exports = MainView;

