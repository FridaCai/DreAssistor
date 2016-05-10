var Menu = React.createClass({
  getInitialState: function() {
        return {
            
        }
    },
    render: function() {
      //todo: remove hard code.

      /*return (<div className="navbar-wrapper">
        <div className="container">

          <nav className="navbar navbar-inverse navbar-static-top">
            <div className="container">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="#">Project name</a>
              </div>
              <div id="navbar" className="navbar-collapse collapse">
                <ul className="nav navbar-nav">
                  <li className="active"><a href="#">Home</a></li>
                  <li><a href="#about">About</a></li>
                  <li><a href="#contact">Contact</a></li>
                  <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span className="caret"></span></a>
                    <ul className="dropdown-menu">
                      <li><a href="#">Action</a></li>
                      <li><a href="#">Another action</a></li>
                      <li><a href="#">Something else here</a></li>
                      <li role="separator" className="divider"></li>
                      <li className="dropdown-header">Nav header</li>
                      <li><a href="#">Separated link</a></li>
                      <li><a href="#">One more separated link</a></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

        </div>
      </div>);*/
      
      var projectName = 'DRE助手';
      var menu1 = '项目信息'
      var menu1_sub1 = '项目时间安排';
      var menu1_sub2 = '项目资料';
      var menu1_sub3 = '项目属性管理';
      var menu2 = '联系我们';

      return (<div className="navbar-wrapper">
        <div className="container" style={{width: '100%', padding:0}}> 
          <nav className="navbar navbar-inverse navbar-static-top">
            <div className="container" >
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
                  
                  <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{menu1} <span className="caret"></span></a>
                    <ul className="dropdown-menu">
                      <li><a href="#">{menu1_sub1}</a></li>
                      <li><a href="#">{menu1_sub2}</a></li>
                      <li><a href="#">{menu1_sub3}</a></li>
                    </ul>
                  </li>

                   <li><a href="#contact">{menu2}</a></li>

                </ul>
              </div>
            </div>
          </nav>

        </div>
      </div>);
    }
});

module.exports = Menu;

    




    