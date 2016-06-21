import CDropDown from '../../widget/dropdown/dropdown.js';
import API from '../api.js';
import Util from '../../../util.js';
import moment from 'moment';

var PropertyPanel = React.createClass({
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
        new Chartist.Line('.ct-chart', data, options);
    },
    
    updateJqueryComponent: function() {
        (function updateTypeDropdown(){
            var defaultKey = this.state.templateType;
            var container = this.refs.typeDropdown;

            var options = [{
                id: '-1',
                label: '全部'
            }].concat(API.getTemplateEnum());
            
            var param = {
                id: "typeDropdown", //string.
                defaultKey: defaultKey, //string. existed id in options.
                options: options,
                onchange: (function(key){
                    
                }).bind(this),
            };
            this.typeDropdown = CDropDown.create(container, param);
        }).call(this);
    },

    onSearch: function(){
        this.setState({
            templateType: this.typeDropdown.getValue(),
        });
    },

    render: function() {
        var getValue = function(line, column){
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
        }

        var getColumnLabelMap = {
            'label': '名称',
            'template.type': '豆豆类型',
            'duration': '执行时间(小时)',
            'template.param.bp.value': '背压',
            'template.param.heavy.value': '重量',
        }

        var condition = (this.state.templateType === '-1' ? undefined: {
            key: 'template.type',
            value: this.state.templateType
        });

        var alltasks = (function(rawProjects){
            var alltasks = [];
            rawProjects.map(function(project){
                var tasks = project.findTasks(condition);
                alltasks = alltasks.concat(tasks);
            });
            return alltasks;
        })(API.getProjectArr());


        var columns = (function(rawProjects){
            var fixedColumns = ['label', 'template.type'];
            var dynamicColumns = API.getStaticalProperties(alltasks);
            return fixedColumns.concat(dynamicColumns);
        })(API.getProjectArr());



        var groups = (function(rawProjects){
            var groups = [];
            rawProjects.map(function(project){
                groups.push({
                    label: project.label,
                    lines: project.findTasks(condition),
                })
            })
            return groups;
        })(API.getProjectArr());





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
                    {
                       groups.map((function(group){
                            var lineNum = 0;
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
                                                            columns.map(function(column){
                                                                var key = `column_${column}`;
                                                                return (<th key={key}>{getColumnLabelMap[column]}</th>)
                                                            })
                                                        }
                                                    </tr> 
                                                </thead> 

                                                <tbody> 
                                                {
                                                    lines.map(function(line){
                                                        var lineId = line.id;
                                                        return (
                                                            <tr key={lineId}>
                                                                <th scope="row">{lineNum++}</th>
                                                                {
                                                                    columns.map(function(column){
                                                                        var columnKey = `${lineId}_${column}`;
                                                                        return (
                                                                            <td key={columnKey}>{getValue(line, column)}</td>
                                                                        )
                                                                    })
                                                                }
                                                            </tr> 
                                                        )
                                                    })
                                                }
                                                </tbody> 
                                            </table>    
                                        </div>
                                    )
                                }
                            }
                        }).bind(this))
                    }


                    <div className="panel-body"> 
                        <div className="ct-chart ct-perfect-fourth" style={{width: '600px',height:'400px'}}></div>
                    </div>  
                </div>
            </div>
        );
    },
});

module.exports = PropertyPanel;