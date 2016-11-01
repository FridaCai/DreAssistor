import Menu from './menu.js';
import Page from './page.js';
import RegisterPopup from './membership/registerpopup.js';
import API from "../api.js";
import MessageBox from 'MessageBox';
import Request from 'Request';
import LoadingMask from 'LoadingMask';

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
        
        Request.signal_response_fail.listen(this.onServerFail);
        Request.signal_request_send.listen(this.onRequestSend);
        Request.signal_response_receive.listen(this.onResponseReceive);
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

        Request.signal_response_fail.unlisten(this.onServerFail);
        Request.signal_request_send.unlisten(this.onRequestSend);
        Request.signal_response_receive.unlisten(this.onResponseReceive);
    },
    onResponseReceive: function(e){
        this.refs.loadingMask.hide();
    },
    onRequestSend: function(e){
        this.refs.loadingMask.show();
    },
    onServerFail: function(e){
        this.refs.loadingMask.hide();
        console.error(e.stack);

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
                <LoadingMask ref='loadingMask'/>
    		</div>
		);
    }
});

module.exports = MainView;

