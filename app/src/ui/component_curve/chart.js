import API from './api.js';

var Chart = React.createClass({
  getInitialState: function(){
    this._chart = null;

    return {
      uidata: this.props.uidata,
    }
  },

  componentDidMount:function(){
    this.update();
  },
  
  //todo: reverse. head ache.
  update: function(){
    try{
      var curve = this.state.uidata.curve;
      var header = curve.header;
      var ui = curve.ui;
    
      if(ui.length < 2)
        return;


      var labels = ui.map(function(line){
        return line.cells[0].v;
      })
      console.table(labels);



      console.log('====================================');
      debugger;
      var lineNum = ui[0].cells.length;
      var series = [];

      for(var j=1; j<lineNum; j++){
        var serie = [];
        for(var k=0; k<ui.length; k++){
          serie.push(ui[k].cells[j].v);
        }
        series.push(serie);
      }

      console.table(series);


      /*
      var series = ui.map(function(line){
        return line.cells.filter(function(cell,index){
          return index === 0;
        })
      })
      */




      debugger;
      //color??

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
    return (
        <div className="ct-chart ct-perfect-fourth" ></div>
    )
  }
})
module.exports = Chart;