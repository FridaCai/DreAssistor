import API from '../../api.js';
import './style.less';

var PageHome = React.createClass({
  getInitialState: function() {
        return {
            
        }
    },
    onNavigate: function(key){
      API.signal_page_navigate.dispatch({key: key})
    },
    render: function() {
      var styleList = {
        task: 'glyphicon glyphicon-tasks',
        hotissue: 'glyphicon glyphicon-fire'
      };
      return (
            <div className="container marketing pageHome">
              <div className="row">
              {
                Object.keys(API.pageMap).map((function(key,index){
                  var {label, controller} = API.pageMap[key];
                  if(key === 'home')
                    return null;
                  else
                    return (
                      <div key={key} className="col-lg-4 item" onClick={this.onNavigate.bind(this, key)}>
                        <span className={styleList[key]}></span>
                        <h2>{label}</h2>
                      </div>
                    )
                  }).bind(this))
              }

              </div>
            </div>
      );
    }
});

module.exports = PageHome;