
var Chart = React.createClass({
  getInitialState: function(){
    return {}
  }
  componentDidMount:function(){

  }
  updateChart: function(){
    var labels = this.state.labels;
    var _series = this.state.series;
    var caption = this.state.caption;

    var series = [];
    for(var i=0; i<_series.length; i++){
      var serie = _series[i];
      series.push(serie.data);
    }

    if(this._chart){
      this._chart.detach();
      this._chart.svg.remove();
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
  render: function(){
    return ()
  }
})