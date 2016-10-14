import API from './api.js';
import Util from 'Util';

var Chart = React.createClass({
  getInitialState: function(){
    this._chart = null;

    return {
      uidata: this.props.uidata,
      id: this.props.id.replace(/\./g, '-')
    }
  },

  componentDidMount:function(){
    this.update();
  },
  
  onToggle: function(){
    var id = this.state.id;
    this.state.uidata.curve.header.cells.map(function(cell, index){
        if(index!=0){
          var char = String.fromCharCode('a'.charCodeAt(0) + index - 1);
          if(!cell.param.isCheck){
            $(`.curveid_${id}`).find(`.ct-series.ct-series-${char}`).hide();
          } else{
            $(`.curveid_${id}`).find(`.ct-series.ct-series-${char}`).show();
          } 
        }
      })
  },
  //todo: reverse. head ache.
  update: function(){
    try{
      var curve = this.state.uidata.curve;
      curve.dump();

      var header = curve.header;
      var ui = curve.ui;
    
      if(ui.length < 2)
        return;


      var labels = ui.map(function(line){
        return line.cells[0].v;
      })



      var lineNum = ui[0].cells.length;
      var series = [];

      for(var j=1; j<lineNum; j++){
        var serie = [];
        for(var k=0; k<ui.length; k++){
          serie.push(ui[k].cells[j].v);
        }
        series.push(serie);
      }

      if(this._chart){
        this._chart.svg.remove();
        this._chart.detach();
      }

      var id = this.state.id;
      var selector = `.curveid_${id}`;
      this._chart = new Chartist.Line(selector, {
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