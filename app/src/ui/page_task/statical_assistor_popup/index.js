import API from '../api.js';
import MessageBox from '../../widget/messagebox.js';
import Table from './property_table.js';
import Chart from './property_chart.js';
import CDropDown from '../../widget/dropdown/dropdown.js';
import Util from '../../../util.js';
import moment from 'moment';

var StaticalAssistorPopup = React.createClass({
    getInitialState: function() {
        return {
            templateType: -1, //-1: all; 0: normal; 1: ewo; 2: hotissue; 3: mule
        };
    },
    componentDidMount: function() {
        this.updateJqueryComponent();
        this.refs.msgbox.show();
    },

    updateJqueryComponent: function() {
        (function updateTypeDropdown(){
            var id = 'typeDropdown';
            var defaultKey = this.state.templateType;
            var container = this.refs[id];

            var options = [{
                id: -1,
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


    show: function(state) {
        var newState = state || this.state;
        this.setState(newState, this.updateJqueryComponent);
        this.refs.msgbox.show();
    },
    onSearch: function(){
        this.setState({
            templateType: parseInt(this.typeDropdown.getValue()),
        });

        this.refs.chart.hideChart();
    },
    getContent: function() {
        var condition = (this.state.templateType === -1 ? null: {
            key: 'template.type',
            value: this.state.templateType
        });

        var allpropertyKeys = (function(rawProjects){
            var tasksFilterByType = API.getProjects().findTasks(condition);
            var dynamicColumns = API.getStaticalProperties(tasksFilterByType);
            return dynamicColumns;
        }).call(this, API.getProjectArr());

        var getStaticalValueHandler = function(line, column){
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
        };

        return (
            <div className='staticalAssistorPopup'>
                <div className="line condition">
                    <label>类型</label>
                    <span ref='typeDropdown'></span>

                    <button className='btn btn-default searchBtn' 
                        onClick={this.onSearch}>
                        Search
                    </button>
                </div>

                <Table condition={condition} allpropertyKeys={allpropertyKeys} getStaticalValueHandler={getStaticalValueHandler}/>
                <Chart condition={condition} allpropertyKeys={allpropertyKeys} getStaticalValueHandler={getStaticalValueHandler} ref='chart' />
            </div>
        )
    },

    onOkClk:function() {
    },

    render: function() {
        var content = this.getContent();
        var title = this.state.title;
        var className = 'assistorMsg';
        return (<MessageBox title={title} isShow={true}
            okHandler={this.onOkClk} ref='msgbox' children={content} cName={className} hideFooter={true}/>
        );
    },
});

module.exports = StaticalAssistorPopup;


