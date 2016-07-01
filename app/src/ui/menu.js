import API from '../api.js';
import {ENUM, CError} from '../exception.js';
import User from '../data/user.js';
import Request from '../request.js';

var LoginUserPart = React.createClass({
    getInitialState: function() {
        return {
        }
    },
    onSignInClk: function(){
      var email = this.refs.emailInput.value;
      var password = this.refs.passwordInput.value;
debugger;
      Request.getData(Request.getBackendAPI('user'), {
        email: email, 
        password: password
      }).then((function(res){
        if(res.errCode != -1){
          throw new CError(res.errCode);
        }
        API.setLoginUser(res.user);
        API.setToken(res.token);
        
        //todo: update ui.
        this.setState({

        })



      }).bind(this)).catch((function(e){
        var msg = ENUM[e.key]().res.msg;

        //todo: setup ui to show error msg.
        this.setState({})
      }).bind(this));




    },
    onRegisterClk: function(){
      API.signal_registerpopup_show.dispatch();
    },
    

    showLoginUserInfo: function(){
      
    },



    logOut: function(){
      API.resetLoginUser();
      API.removeToken();


      //todo: update ui.
    },

    render:function(){
      var loginUser = API.getLoginUser();
      var isLogin = loginUser ? true: false;

      if (isLogin) {
        return (
          <ul class="nav navbar-nav navbar-right" data-reactid=".0.0.0.1.1">
            <li class="dropdown open">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">
                {loginUser.name}
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu">
                <li><a href="javascript: void(0);" onClick={this.showLoginUserInfo}>个人信息</a></li>
                <li><a href="javascript: void(0);" onClick={this.logOut}>退出登录</a></li>
              </ul>
            </li>
          </ul>
        )
      } else {
        return (
          <div className="navbar-form navbar-right">
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
    }
})

var Menu = React.createClass({
    getInitialState: function() {
        return {
            
        }
    },

    render: function() {
      var projectName = '豆豆';
      var menu1 = '首页'
      var menu2 = '联系我们';

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
                <li className="active"><a href="#">{menu1}</a></li>
                <li><a href="#about">{menu2}</a></li>
              </ul>

              <LoginUserPart/>
              
            </div>
          </div>
        </nav>    
      );
    }
});

module.exports = Menu;