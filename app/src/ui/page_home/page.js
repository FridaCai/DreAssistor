import API from '../../api.js';

var PageHome = React.createClass({
  getInitialState: function() {
        return {
            
        }
    },
    onNavigate: function(key){
      API.signal_page_navigate.dispatch({key: key})
    },
    render: function() {
      var t = API;
      return (
            <div className="container marketing pageHome">
              <div className="row">
              {
                Object.keys(API.pageMap).map((function(key){
                  var {label, controller} = API.pageMap[key];
                  if(key === 'home')
                    return null;
                  else
                    return (
                      <div key={key} className="col-lg-4 item" onClick={this.onNavigate.bind(this, key)}>
                        <img className="img-circle" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image" width="140" height="140"/>
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