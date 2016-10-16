import API from './api.js';
import Util from 'Util';

var Chart = React.createClass({
  getInitialState: function(){
    this._chart = null;

    return {
      curve: this.props.curve,
      id: this.props.id.replace(/\./g, '-')
    }
  },

  componentDidMount:function(){
    this.update();
  },
  componentWillReceiveProps: function(newProps){
    this.setState({curve: newProps.curve}, this.update);
  },
  onToggle: function(){
    return;
    /*var id = this.state.id;
    this.state.uidata.curve.header.cells.map(function(cell, index){
        if(index!=0){
          var char = String.fromCharCode('a'.charCodeAt(0) + index - 1);
          if(!cell.param.isCheck){
            $(`.curveid_${id}`).find(`.ct-series.ct-series-${char}`).hide();
          } else{
            $(`.curveid_${id}`).find(`.ct-series.ct-series-${char}`).show();
          } 
        }
      })*/
  },
  update: function(){
    try{
      var curve = this.state.curve;
      if(!curve)
        return;
    
      var labels = curve.data[0];
      var series = [];
      curve.data.map(function(dataarr, index){
        if(index !=0){
          series.push(dataarr);
        }
      })

      if(this._chart){
        this._chart.svg.remove();
        this._chart.detach();
      }

      var id = this.state.id;
      var selector = `.curveid_${id}`;

      var numXLbl = Math.min(20, labels.length);
      var step = Math.round(labels.length / numXLbl);




      this._chart = new Chartist.Line(selector, {
        labels: labels,
        series: series,
      }, {
        width: '1000px',
        fullWidth: true,
        lineSmooth: false,
        chartPadding: {
          right: 20,
          left: 10
        },
        axisX: {
          labelInterpolationFnc: function(value, i) {
            if(i%step === 0){
              return Math.round(value);
            }
          }
        }
      });  

      this._chart.on('created', (function(){
        var j=0;
        var asc_a = 'a'.charCodeAt(0);
        var asc_z = 'z'.charCodeAt(0);
        for(var i=asc_a; i<=asc_z; i++){
          var char = String.fromCharCode(i);
          var color = Util.convertIntColorToHex(Util.COLORS[j++]);
          $(`.curveid_${id}`).find(`.ct-series.ct-series-${char} .ct-point`).css({'stroke': color});
          $(`.curveid_${id}`).find(`.ct-series.ct-series-${char} .ct-line`).css({'stroke': color});
        }
      }).bind(this));
    }catch(e){
      console.log(e.stack);
    }
    
  },

  
  /*onCurveToggle:function(param){
    var index = param.index;
    var isShowCurve = param.isShowCurve;

    if(isShowCurve){
      $($('.ct-series')[index]).show();     
    }else{
      $($('.ct-series')[index]).hide();   
    }
    
  },*/

  
  render: function(){
    var id = this.state.id;
    var className = `ct-chart ct-perfect-fourth curveid_${id}`;
    return (
        <div className={className} ></div>
    )
  }
})
module.exports = Chart;