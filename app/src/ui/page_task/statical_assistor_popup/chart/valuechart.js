import ComboBox from 'ComboBox';
import Util from 'Util';
import API from '../api.js';

var ValueChart = React.createClass({
    _chart:undefined,

    getInitialState: function() {
        this._chart = null;
        return {
          uidata: undefined,
          id: this.props.id.replace(/\./g, '-'),
          graphicType: 1,
        }
    },
	componentDidMount: function() {
    },

    update: function(param){
        try{
            var uidata = param.uidata || this.state.uidata;
            
            var graphicType = param.graphicType;
            if(param.graphicType == undefined){
                graphicType = this.state.graphicType;
            }

            this.setState({uidata: uidata, graphicType: graphicType});

            if(this._chart){
                this._chart.svg.remove();
                this._chart.detach();
            }

            var {labels, series} = uidata;
            var id = this.state.id;
            var selector = `.curveid_${id}`;


            var creatorClass, chartSeries;
            switch(graphicType){
                case 0:
                    creatorClass = Chartist.Bar;
                    chartSeries = [series];
                    break;
                case 1:
                    creatorClass = Chartist.Line;
                    var avgSeries = (function(series){
                        var sum = 0;
                        series.map(function(v){
                            sum += parseFloat(v);
                        })
                        var avg = sum/series.length;
                        return series.map(function(){
                            return avg;
                        })
                    })(series);
                    chartSeries = [series, avgSeries];

                    //chartSeries = series;
                    break;
                case 2:
                    creatorClass = Chartist.Pie;
                    chartSeries = series;
            }

            this._chart = new creatorClass(selector, {
                labels: labels,
                series: chartSeries
            }, {
                width: 600,
                height: 400
            });  

            /*
            {
                width: 600,
                height: 400
            }
            {
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
            }

            */
            



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

    render:function(){
    	var id = this.state.id;
        var className = `ct-chart ct-perfect-fourth curveid_${id}`;
        var compoboxParam = {
            selectedId: this.state.graphicType,
            options: [
                {id: 0, label: '柱状图'},
                {id: 1, label: '曲线图'},
                {id: 2, label: '饼图'}
            ],
            onchange: (function(selectedKey){
                this.update({graphicType:selectedKey});
            }).bind(this)
        };
        return (
            <div className='chart'>
                <ComboBox param={compoboxParam}/>
                <div className={className}></div>
            </div>
        )
    },
})
module.exports = ValueChart;



