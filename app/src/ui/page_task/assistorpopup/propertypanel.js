import CDropDown from '../../widget/dropdown/dropdown.js';
import API from '../api.js';
import Util from '../../../util.js';
import moment from 'moment';

var PropertyPanel = React.createClass({
    _alltasks: undefined,
    _condition: undefined,

    _chart:undefined,

    getInitialState: function() {
        return {
            templateType: '-1', //-1: all; 0: normal; 1: ewo; 2: hotissue; 3: mule
        };
    },
    
    componentDidMount: function() {
        this.updateJqueryComponent();
        this.updateChart();
    },

    updateChart: function(){
        var data = {
          // A labels array that can contain any sort of values
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          // Our series array that contains series objects or in this case series data arrays
          series: [
            [10, 2, 4, 2, 0]
          ]
        };

        var options = {
          width: 600,
          height: 400
        };
        this._chart = new Chartist.Line('.ct-chart', data, options);
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
            var properties = API.getStaticalProperties(this._getAllTasks());
            var id = 'yAxisDropdown';
            var defaultKey = properties[0];
            var container = this.refs[id];

            
            var options = properties.map((function(property){
                return {
                    id: property,
                    label: this._getColumnLabelMap(property),
                }
            }).bind(this));


            var param = {
                id: id,
                defaultKey: defaultKey,
                options: options
            };
            this[id] = CDropDown.create(container, param);
            
        }).call(this);

        (function updateTypeDropdown(){
            var id = 'typeDropdown';
            var defaultKey = this.state.templateType;
            var container = this.refs[id];

            var options = [{
                id: '-1',
                label: '全部'
            }].concat(API.getTemplateEnum());
            
            var param = {
                id: id, //string.
                defaultKey: defaultKey, //string. existed id in options.
                options: options,
            };
            this[id] = CDropDown.create(container, param);
        }).call(this);
    },

    onSearch: function(){
        this.setState({
            templateType: this.typeDropdown.getValue(),
        });
    },

    _getCondition: function(){ //todo: should cache data.
        return (this.state.templateType === '-1' ? undefined: {
            key: 'template.type',
            value: this.state.templateType
        });
    },
    _getAllTasks: function(){ //todo: should cache data.
        var alltasks = [];
        API.getProjectArr().map((function(project){
            var tasks = project.findTasks(this._getCondition());
            alltasks = alltasks.concat(tasks);
        }).bind(this));
        return alltasks;
    },

    _getColumnLabelMap: function(column) {
        return {
            'label': '名称',
            'template.type': '豆豆类型',
            'duration': '执行时间(小时)',
            'template.param.bp.value': '背压(Kpa)',
            'template.param.heavy.value': '重量(Kg)',
        }[column]
    },

    onRefreshGraph: function(){
        this._chart.detach();
        this._chart.svg.remove();

        //get indices and property from xAxisInput and yAxisDropdown.
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
        var property = this.yAxisDropdown.getValue();

        

        //filter task. by x input and y input.
        var alltasks = this._getAllTasks();
        var tasks = alltasks.filter(function(task, index){
            if(indices.indexOf(index) === -1)
                return false;

            var value = this._getValue(task, property);
            if(!value)
                return false;

            return true;
        }.bind(this))
        

        //build series and labels
        var series = [];
        var labels = [];
        var avgSeries = [];


        var graphSeries = tasks.map((function(task){
            labels.push(task.label);
            series.push(this._getValue(task, property));
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
        if(graphType === '0'){
            this._chart = new Chartist.Bar('.ct-chart', {labels: labels, series: [series]}, options);
        }else if(graphType === '1'){
            this._chart = new Chartist.Line('.ct-chart', {labels: labels, series: [series, avgSeries]}, options);
        }else if(graphType === '2'){
            this._chart = new Chartist.Pie('.ct-chart', {labels: labels, series: series}, options);
        }
    },

    onExportImg: function(){

    },

    onExportExcel: function(){

    },

    _getValue: function(line, column){
        if(column === 'duration'){
            var start = moment(line.startTime);
            var end = moment(line.endTime);
            var duration = end.diff(start, 'hours');
            return duration;
        }else if(column === 'template.type'){
            var template = API.getTemplateEnum().find(function(template){
                return (line.template.type ===  template.id);
            })
            return template.label;
        }
        return Util.getValue(line, column);
    },

    render: function() {
        var columns = (function(rawProjects){
            var fixedColumns = ['label', 'template.type'];
            var dynamicColumns = API.getStaticalProperties(this._getAllTasks());
            return fixedColumns.concat(dynamicColumns);
        }).call(this, API.getProjectArr());


        var groups = (function(rawProjects){
            var groups = [];
            rawProjects.map((function(project){
                groups.push({
                    label: project.label,
                    lines: project.findTasks(this._getCondition()),
                })
            }).bind(this))
            return groups;
        }).call(this, API.getProjectArr());


        var xAxisdefaultValue = `0-${this._getAllTasks().length-1}`;
        var lineNum = 0;

        return (
            <div className='infoSearchPanel'>
                <div className="line condition">
                    <label>类型</label>
                    <span ref='typeDropdown'></span>

                    <button className='btn btn-default searchBtn' 
                        onClick={this.onSearch}>
                        Search
                    </button>
                </div>

                <div className="panel panel-default"> 
                    <div className='tableSession'>
                        {
                           groups.map((function(group){
                                
                                var lines = group.lines;
                                var header = group.label;
                                {
                                    if(lines.length){
                                        return (
                                            <div className='projectDom' key={header}>
                                                <div className="panel-heading">项目： {header}</div>
                                                <table className="table"> 
                                                    <thead> 
                                                        <tr>
                                                            <th>#</th>
                                                            {
                                                                columns.map((function(column){
                                                                    var key = `column_${column}`;
                                                                    return (<th key={key}>{this._getColumnLabelMap(column)}</th>)
                                                                }).bind(this))
                                                            }
                                                        </tr> 
                                                    </thead> 

                                                    <tbody> 
                                                    {
                                                        lines.map((function(line){
                                                            var lineId = line.id;
                                                            return (
                                                                <tr key={lineId}>
                                                                    <th scope="row">{lineNum++}</th>
                                                                    {
                                                                        columns.map((function(column){
                                                                            var columnKey = `${lineId}_${column}`;
                                                                            return (
                                                                                <td key={columnKey}>{this._getValue(line, column)}</td>
                                                                            )
                                                                        }).bind(this))
                                                                    }
                                                                </tr> 
                                                            )
                                                        }).bind(this))
                                                    }
                                                    </tbody> 
                                                </table>    
                                            </div>
                                        )
                                    }
                                }
                            }).bind(this))
                        }
                    </div>
                    <div className='chartSession'>
                        <div className="panel-body"> 
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
                            <div className="ct-chart ct-perfect-fourth" style={{width: '600px',height:'400px'}}></div>
                        </div>  
                    </div>
                </div>
            </div>
        );
    },
});

module.exports = PropertyPanel;