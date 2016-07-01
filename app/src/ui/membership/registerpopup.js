import MessageBox from '../widget/messagebox.js';
import API from '../../api.js';
import Util from '../../util.js';
import Request from '../../request.js';

var RegisterPopup = React.createClass({
  	getInitialState: function() {
        return {
            isValid: true,
            errorMsg: '',
        }
    },

    show: function(state) {
        var newState = state || this.state;
        this.setState(newState, this.updateAfterMount);
        this.refs.msgbox.show();
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

    onOkClk:function() {
    	var getValInfo = function(name, email, password, confirmpassword){
    		if(!name){
    			return {
    				isValid: false,
    				errorMsg: '请输入用户名'
    			}
    		}

    		if(!email){
    			return {
    				isValid: false,
    				errorMsg: '请输入邮箱'
    			}
    		}

    		var emailPatten = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    		if(!emailPatten.test(email)){
    			return {
    				isValid: false,
    				errorMsg: '请输入合法的邮箱'
    			}
    		}

    		if(!password){
    			return {
    				isValid: false,
    				errorMsg: '请输入密码'
    			}
    		}
    		
    		if(!confirmpassword){
				return {
    				isValid: false,
    				errorMsg: '请再次输入密码'
    			}
			}
    		
    		if(password != confirmpassword){
    			return {
    				isValid: false,
    				errorMsg: '输入的两次密码不一致'
    			}
    		}

    		return {
    			isValid: true,
    			errorMsg: ''
    		}
    	}

    	var name = this.refs.nameInput.value;
    	var email = this.refs.emailInput.value;
    	var password = this.refs.passwordInput.value;
    	var passwordConfirm = this.refs.passwordConfirmInput.value;
    	var valInfo = getValInfo(name, email, password, passwordConfirm);
        var url = Request.getBackendAPI('user');


        if(!valInfo.isValid){
            this.setState({
                isValid: valInfo.isValid,
                errorMsg: valInfo.errorMsg,
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
				Promise.reject();//email already registered.
			}

			API.setLoginUser(res.person);
			API.sigal_loginHeader_update.dispatch();
            Promise.resolve(); //why popup not closed???
		}).bind(this));
    	
    },

    render: function() {
        var content = this.getContent();
        var title = this.state.title;
        var className = 'registerMsg';
        return (<MessageBox title={title} 
            okHandler={this.onOkClk} ref='msgbox' children={content} cName={className}/>
        );
    },
});

module.exports = RegisterPopup;