import API from '../api.js';
import {ENUM, CError} from '../exception.js';
import User from '../data/user.js';
import Request from '../request.js';

       
var UserCenterContainer = React.createClass({
    getInitialState: function() {
        return {
          userName: '', //login.
        }
    },

    logOut: function(){
      API.resetLoginUser();
      API.removeToken();
      API.sigal_logout.dispatch();

    },
    render: function(){
      var loginUser = API.getLoginUser();
        return (
          <ul className="nav navbar-nav navbar-right" data-reactid=".0.0.0.1.1">
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">
                {loginUser.name}
                <span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li><a href="javascript: void(0);" onClick={this.showLoginUserInfo}>个人信息</a></li>
                <li><a href="javascript: void(0);" onClick={this.logOut}>退出登录</a></li>
              </ul>
            </li>
          </ul>
        )
    }
})

var LoginContainer = React.createClass({
    getInitialState: function() {
        return {
          errormsg: ''
        }
    },
    onSignInClk: function(){
      var email = this.refs.emailInput.value;
      var password = this.refs.passwordInput.value;
      Request.getData(Request.getBackendAPI('user'), {
        email: email, 
        password: password
      }).then((function(res){
        if(res.errCode != -1){
          throw new CError(res.errCode);
        }
        API.setLoginUser(res.user);
        API.setToken(res.token);
        
        API.sigal_login.dispatch();

      }).bind(this)).catch((function(e){
        var msg = ENUM[e.key]().res.msg;

        this.setState({
          errormsg: msg
        })
      }).bind(this));
    },

    onRegisterClk: function(){
      API.signal_registerpopup_show.dispatch();
    },

    render:function(){
      var msg = this.state.errormsg;

      return (
        <div className="navbar-form navbar-right">
          <div className="form-group" style={{color:'white'}}>
            {msg}
          </div>
          <div className="form-group">
            <input type="text" placeholder="Email" className="form-control" ref='emailInput'/>
          </div>

          <div className="form-group">
            <input type="password" placeholder="Password" className="form-control" ref='passwordInput'/>
          </div>
          <button className="btn btn-success" onClick={this.onSignInClk}>Sign in</button>
          <button className="btn btn-success" onClick={this.onRegisterClk}>Register</button>
        </div>
      )
    }
})

var Menu = React.createClass({
    getInitialState: function() {
        return {
            
        }
    },
    onNavigate: function(key){
      API.signal_page_navigate.dispatch({key: key});
    },
    render: function() {
      var projectName = '豆豆';

  
      
      var getLoginDom = function(){
        var isLogin = API.isLogin();
        if(isLogin)
          return(<UserCenterContainer/>)
        else return (<LoginContainer/>)
      }

      return (
        <nav className="navbar navbar-inverse navbar-static-top">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">{projectName}</a>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav">

              {
                Object.keys(API.pageMap).map((function(key){
                  var {label} = API.pageMap[key];
                  

                  //var className = ((key === API.curpage) ? "active": "");
                  var className = "";
                  return (
                    <li className={className} key={key} onClick={this.onNavigate.bind(this, key)}>
                      <a href="javascript:void(0);">{label}</a>
                    </li>
                  )
                }).bind(this))
              }
                
              </ul>
              {getLoginDom()}
              
            </div>
          </div>
        </nav>    
      );
    }
});

module.exports = Menu;