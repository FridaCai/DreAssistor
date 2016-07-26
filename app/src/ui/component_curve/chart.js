import API from './api.js';

var Chart = React.createClass({
  getInitialState: function(){
    this._chart = null;

    return {
      
    }
  },

  componentDidMount:function(){
    this.update();
  },
  
  update: function(){
    var labels = API.curve.labels || [];
    var _series = API.curve.series || [];
    var caption = API.curve.caption || [];

    var series = [];
    for(var i=0; i<_series.length; i++){
      var serie = _series[i];

      series.push(serie.data);
    }

    if(this._chart){
      this._chart.svg.remove();
      this._chart.detach();
    }

    this._chart = new Chartist.Line('.ct-chart', {
      labels: labels,
      series: series,
    }, {
      fullWidth: true,
      lineSmooth: false,
      chartPadding: {
        right: 20,
        left: 10
      },
      axisX: {
        labelInterpolationFnc: function(value) {
          if(value % 500 === 0){
            return value;  
          }
        }
      }
    });
  },
  onCurveToggle:function(param){
    var index = param.index;
    var isShow = param.isShow;

    if(isShow){
      $($('.ct-series')[index]).show();     
    }else{
      $($('.ct-series')[index]).hide();   
    }
    
  },

  
  render: function(){
    return (
        <div className="ct-chart ct-perfect-fourth" ></div>
    )
  }
})
module.exports = Chart;