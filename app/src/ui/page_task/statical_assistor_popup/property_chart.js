import UploadExcelComponent from '../../widget/excel/index.js';
import CDropDown from '../../widget/dropdown/dropdown.js';
import Util from '../../../util.js';
import API from '../api.js';

var Chart = React.createClass({
    _chart:undefined,

    getInitialState: function() {
        return {
        	isShowChart: false,
        	isExcelChart: false,


        };
    },
	componentDidMount: function() {
        this.updateJqueryComponent();
    },
    
    updateJqueryComponent: function() {
        (function updateGraphTypeDropdown(){
            var id = 'graphicTypeDropdown';
            var defaultKey = '0';
            var container = this.refs[id];

            var options = [
                {id: '0', label: '柱状图'},
                {id: '1', label: '曲线图'},
                {id: '2', label: '饼图'}
            ]
            var param = {
                id: id,
                defaultKey: defaultKey, 
                options: options
            };
            this[id] = CDropDown.create(container, param);
        }).call(this);

        (function updateYAxisDropdown(){
            var properties = this.props.allpropertyKeys;
            var id = 'yAxisDropdown';
            var defaultKey = properties[0];
            var container = this.refs[id];
            
            var options = properties.map((function(property){
                return {
                    id: property,
                    label: Util.COLUMN_LABLE_MAP[property],
                }
            }).bind(this));

            var param = {
                id: id,
                defaultKey: defaultKey,
                options: options
            };
            this[id] = CDropDown.create(container, param);
            
        }).call(this);
    },

    onExportImg: function(){

    },

    onExportExcel: function(){

    },

    onRefreshGraph:function(){
    	this.setState({
    		isShowChart: true,
    		isExcelChart: (function(property){
    			if(property === 'template.param.snorkelNoiseXls'){
    				return true;
    			}else return false;
    		})(this.yAxisDropdown.getValue())
    	}, this.updateChart);
    },

    updateChart: function(){
    	var condition = this.props.condition;
    	var getStaticalValueHandler = this.props.getStaticalValueHandler;
    	var property = this.yAxisDropdown.getValue();

        var indices = (function(xAxisLabel){
            var indices = [];
            xAxisLabel.split(',').map(function(block){
                if(block.indexOf('-') === -1){
                    indices.push(parseInt(block));
                }else{
                    var start = parseInt(block.split('-')[0]);
                    var end = parseInt(block.split('-')[1]);

                    var i = start;
                    while(i <= end){
                        indices.push(i++);
                    }
                }
            })
            return indices;
        })(this.refs.xAxisInput.value);

        var tasks = API.getProjects().findTasks(condition).filter(function(task, index){
            if(indices.indexOf(index) === -1)
                return false;

            var value = this.props.getStaticalValueHandler(task, property);
            if(!value)
                return false;
            return true;
        }.bind(this))





    	if(this.state.isExcelChart){
    		 var snorkelNoiseXls = tasks.map((function(task){
	            return getStaticalValueHandler(task, property);
	        }).bind(this));
		    this.refs.uploadExcelComponent.setState({
		        fileNames: snorkelNoiseXls,
		    }, (function(){
		        this.refs.uploadExcelComponent.execute(snorkelNoiseXls);
		    }).bind(this))
    		return;
    	}


    	if(this._chart){
            this._chart.detach();
            this._chart.svg.remove();    
        }


        //build series and labels
        var series = [];
        var labels = [];
        var avgSeries = [];


        var graphSeries = tasks.map((function(task){
            labels.push(task.label);
            series.push(getStaticalValueHandler(task, property));
        }).bind(this))



        var sum = 0;
        series.map(function(v){
            sum += parseFloat(v);
        })
        var avg = sum/series.length;
        var avgSeries = series.map(function(){
            return avg;
        })
        var options = {
          width: 600,
          height: 400
        };

        var graphType = this.graphicTypeDropdown.getValue();
        var containerSelector = '.propertyChart';
        if(graphType === '0'){
            this._chart = new Chartist.Bar(containerSelector, {labels: labels, series: [series]}, options);
        }else if(graphType === '1'){
            this._chart = new Chartist.Line(containerSelector, {labels: labels, series: [series, avgSeries]}, options);
        }else if(graphType === '2'){
            this._chart = new Chartist.Pie(containerSelector, {labels: labels, series: series}, options);
        }
    },

    hideChart: function(){
    	this.setState({
    		isShowChart: false,
    	})
    },
    render:function(){
    	var condition = this.props.condition;
		var allpropertyKeys = this.props.allpropertyKeys;
		var getStaticalValueHandler = this.props.getStaticalValueHandler;
		var isExcelChart = this.state.isExcelChart;
		var isShowChart = this.state. isShowChart;

		var xAxisdefaultValue = (function(){
    		var num = API.getProjects().findTasks(condition).length;
    		return `0-${num-1}`;
    	})()


    	var getChartDom = function(){
    		if(!isShowChart){
        		return null;
        	}
        	if(isExcelChart){
        		return (<UploadExcelComponent isForbidUpload={true} ref='uploadExcelComponent'/>);
        	}else{
        		return (<div className="propertyChart ct-chart ct-perfect-fourth"></div>)
        	}
    	}


    	return (
	 		<div className='chartSession panel-body'>
	            <div className='axisControl'>
	                <div className='line x'>
	                    <label>x轴:</label>
	                    <input className='xAxisInput' ref='xAxisInput' defaultValue={xAxisdefaultValue}/>
	                    <span className='hint'>eg: 0,1,2-3,4</span>
	                </div>
	                <div className='line y'>
	                    <label>y轴:</label>
	                    <span className='yAxisDropdown' ref='yAxisDropdown'></span>
	                </div>
	                <div className='line graphType'>
	                    <label>图表类型：</label>
	                    <span className='graphicTypeDropdown' ref='graphicTypeDropdown'></span>
	                </div>
	                <div className='line'>
	                    <button className='btn btn-default' 
	                        onClick={this.onRefreshGraph}>
	                        画图表
	                    </button>
	                    <button className='btn btn-default' 
	                        onClick={this.onExportImg}>
	                        导出图片
	                    </button>
	                    <button className='btn btn-default' 
	                        onClick={this.onExportExcel}>
	                        导出excel
	                    </button>
	                </div>
	            </div>
                <div className='chartContainer'>
                {getChartDom()}    
                </div>
	            
	        </div>
        )
    },
})
module.exports = Chart;