//import UploadExcelComponent from '../../widget/excel/index.js';
import CDropDown from 'CDropDown';
import Util from 'Util';
import API from '../api.js';

var Chart = React.createClass({
    _chart:undefined,

    getInitialState: function() {
        this._chart = null;
        return {
          uidata: this.props.uidata,
          id: this.props.id.replace(/\./g, '-')
        }
    },
	componentDidMount: function() {
    },

    update: function(curveData){
        try{
            this.setState({uidata: curveData});

            if(this._chart){
                this._chart.svg.remove();
                this._chart.detach();
            }

            var {labels, series} = curveData;

            var id = this.state.id;
            var selector = `.curveid_${id}`;
            this._chart = new Chartist.Line(selector, {
                labels: labels,
                series: [series],
            }, {
                fullWidth: true,
                lineSmooth: false,
                chartPadding: {
                  right: 20,
                  left: 10
                },
            axisX: {
                labelInterpolationFnc: function(value) {
                   return value; //short term solution.
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

    render:function(){
    	var id = this.state.id;
        var className = `ct-chart ct-perfect-fourth curveid_${id}`;
        return (
            <div className={className} ></div>
        )
    },
})
module.exports = Chart;