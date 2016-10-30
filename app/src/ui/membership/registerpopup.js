import MessageBox from 'MessageBox';
import GlobalAPI from 'api.js';
import Util from 'Util';
import Request from 'Request';
import {ENUM, CError} from '../../exception.js';
import User from 'data/user.js';

var RegisterPopup = React.createClass({
  	getInitialState: function() {
        return {
            isValid: true,
            errorMsg: '',
        }
    },

    getContent: function() {
		var style = this.state.isValid ? {visibility: 'hidden'} : {visibility: 'visible'};
		var errorMsg = this.state.errorMsg;

        return (
            <div className='registerPopup'>
	    		<div className='line' >
	            	<label>用户名</label>
	            	<input ref='nameInput'/>
	        	</div>
	        	<div className='line'>
	        		<label>邮箱</label>
	            	<input ref='emailInput'/>
	        	</div>
	        	<div className='line'>
	        		<label>密码</label>
	        		<input ref='passwordInput'/>
	        	</div>
	        	<div className='line'>
	        		<label>重复密码</label>
	        		<input ref='passwordConfirmInput'/>
	        	</div>
	        	<div className="line errorMsg" style={style} ref='errorMsg'>{errorMsg}</div>	
            </div>
        )
    },

    onOK:function() {
        var errorMap = { 
            c0: '请输入用户名',
            c1: '请输入邮箱',
            c2: '请输入合法的邮箱',
            c3: '请输入密码',
            c4: '请再次输入密码',
            c5: '输入的两次密码不一致',
        };

    	var getErrorInfo = function(name, email, password, confirmpassword){
    		if(!name){
    			return 'c0';
    		}

    		if(!email){
    			return 'c1';
    		}

    		var emailPatten = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    		if(!emailPatten.test(email)){
    			return 'c2';
    		}

    		if(!password){
    			return 'c3';
    		}
    		
    		if(!confirmpassword){
				return 'c4';
			}
    		
    		if(password != confirmpassword){
    			return 'c5';
    		}

    		return null
    	}

    	var name = this.refs.nameInput.value;
    	var email = this.refs.emailInput.value;
    	var password = this.refs.passwordInput.value;
    	var passwordConfirm = this.refs.passwordConfirmInput.value;
    	var errorInfo = getErrorInfo(name, email, password, passwordConfirm);
        var url = Request.getBackendAPI('user');


        if(errorInfo){
            this.setState({
                isValid: false,
                errorMsg: errorMap[errorInfo],
            })
            return Promise.reject();
        }


		return Request.postData(url, {
            name: name,
            email: email,
            password: password,    
		}, {
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
        }).then((function(res){
			if(res.errCode != -1){
                throw new CError(res.errCode);
			}

			GlobalAPI.setLoginUser({
                id: res.userId,
                name: name,
                email: email,
            });
            GlobalAPI.setToken(res.token, res.expires);
			GlobalAPI.signal_login.dispatch();
            Promise.resolve(); 
            
		}).bind(this)).catch((function(e){
            var msg = ENUM[e.key]().res.msg;
            this.setState({
                isValid: false,
                errorMsg: msg,
            })
            return Promise.reject();
        }).bind(this));
    },

    render: function() {
        var content = this.getContent();
        var title = this.state.title;
        var className = 'registerMsg';
        return (<MessageBox title={title} 
            onOK={this.onOK} ref='msgbox' children={content} cName={className} isShow={true}/>
        );
    },
});

module.exports = RegisterPopup;