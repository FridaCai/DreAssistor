import Menu from './menu.js';
import Page from './page.js';
import RegisterPopup from './membership/registerpopup.js';
import API from "../api.js";
import MessageBox from 'MessageBox';

var MainView = React.createClass({
	getInitialState: function() {
        return {
        }
    },
    componentDidMount: function(){
        API.signal_registerpopup_show.listen(this.showRegisterPopup);
        API.signal_login.listen(this.onLogin);
        API.signal_logout.listen(this.onLogout);
        API.signal_login_timeout.listen(this.onLoginTimeOut);
        


        API.signal_server_fail.listen(this.onServerFail);

    },


    onLoginTimeOut: function(){
        var msg='登录超时，请重新登录！';
        ReactDOM.unmountComponentAtNode(this.refs.popup);    
        ReactDOM.render(<MessageBox msg={msg} cName={'msg_4_2'} isShow={true}/>, this.refs.popup);
    },

    componentWillUnmount: function(){
        API.signal_registerpopup_show.unlisten(this.showRegisterPopup); 
        API.signal_login.unlisten(this.onLogin);
        API.signal_logout.unlisten(this.onLogout);
        API.signal_login_timeout.unlisten(this.onLoginTimeOut);

        API.signal_server_fail.unlisten(this.onServerFail);
    },
    onServerFail: function(){
        var msg='服务器异常！';
        ReactDOM.unmountComponentAtNode(this.refs.popup);    
        ReactDOM.render(<MessageBox msg={msg} cName={'msg_4_2'} isShow={true}/>, this.refs.popup);
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

