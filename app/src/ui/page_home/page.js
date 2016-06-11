import API from '../../api.js';

var PageHome = React.createClass({
  getInitialState: function() {
        return {
            
        }
    },
    onVisitTaskPageClk: function(){
      API.signal_page_refresh.dispatch({controller: 'PageTask'})
    },
    render: function() {
      var itm1 = "待办事项";
      var itm2 = "零件库";
      var itm3 = "统计";
      return (
            <div className="container marketing pageHome">
              <div className="row">
                <div className="col-lg-4 item" onClick={this.onVisitTaskPageClk}>
                  <img className="img-circle" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image" width="140" height="140"/>
                  <h2>{itm1}</h2>
                </div>
                <div className="col-lg-4 item">
                  <img className="img-circle" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image" width="140" height="140"/>
                  <h2>{itm2}</h2>
                </div>
                <div className="col-lg-4 item">
                  <img className="img-circle" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image" width="140" height="140"/>
                  <h2>{itm3}</h2>
                </div>
              </div>
            </div>
      );
    }
});

module.exports = PageHome;