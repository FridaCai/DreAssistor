import CDropDown from '../../widget/dropdown/dropdown.js';
import NormalTemplate from './template_normal.js';
import HotIssueTemplate from './template_hotissue.js';
import SizeDetectTemplate from './template_sizedetect.js';

var TaskTemplatePanel = React.createClass({
    templatePanel: [NormalTemplate, HotIssueTemplate, SizeDetectTemplate],
    dom: undefined,
    templateTypeDropdown: undefined,

    getInitialState: function() {
        return {
            type: this.props.template.type,
            param: $.extend(true, {}, this.props.template.param),
        }
    },

    updateJqueryComponent: function(){
        (function updateTaskTemplateDropdown(){
            var container = this.refs.templateTypeDropdown;
            var options = [{
                id: 0,
                label: "普通模版",
            },{
                id: 1,
                label: "Hot Issue 模版"
            },{
                id: 2,
                label: "尺寸检测模版"
            }];

            var defaultKey = this.state.type;
            var param = {
                id: "templateTypeDropdown", //string.
                defaultKey: defaultKey, //string. existed id in options.
                options: options,
                onchange: (function(key){
                    this.setState({
                        type: key,
                    })
                    this.updateTemplatePanelByIndex(key);
                }).bind(this),
            };
            this.templateTypeDropdown = CDropDown.create(container, param);
        }).call(this);
    },

    componentDidMount: function(){
        this.updateJqueryComponent();

        var type = this.state.type;
        this.updateTemplatePanelByIndex(type);
    },

    updateTemplatePanelByIndex: function(index){
        var el = React.createElement(this.templatePanel[index], this.state.param);
        this.dom = ReactDOM.render(el, this.refs.templatePanel);
    },
    getValue: function(){
        var type = this.templateTypeDropdown.getValue();
        var param = this.dom.getValue();

        return {
            type: type,
            param: param,
        }
    },
    render: function(){
        return (
            <div className='taskTemplateContainer'>
                <span ref='templateTypeDropdown'/>
                
                <div ref='templatePanel'></div>
            </div>
        )
        
    }

});
module.exports = TaskTemplatePanel;