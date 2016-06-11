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

              <form className="navbar-form navbar-right">
                <div className="form-group">
                  <input type="text" placeholder="Email" className="form-control"/>
                </div>
                <div className="form-group">
                  <input type="password" placeholder="Password" className="form-control"/>
                </div>
                <button type="submit" className="btn btn-success">Sign in</button>
                <button type="submit" className="btn btn-success">Register</button>
              </form>
            </div>


          </div>
        </nav>    
      );
    }
});

module.exports = Menu;