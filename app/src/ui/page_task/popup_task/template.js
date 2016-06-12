import CDropDown from '../../widget/dropdown/dropdown.js';
import NormalTemplate from './template_normal.js';
import HotIssueTemplate from './template_hotissue.js';
import SizeDetectTemplate from './template_sizedetect.js';

var TaskTemplatePanel = React.createClass({
    templatePanel: [NormalTemplate, HotIssueTemplate, SizeDetectTemplate],

    getInitialState: function() {
        return {
            template: this.props.template,
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

            var defaultKey = 0;
            var param = {
                id: "templateTypeDropdown", //string.
                defaultKey: defaultKey, //string. existed id in options.
                options: options,
                onchange: (function(key){
                    this.updateTemplatePanel(key);
                }).bind(this),
            };
            this.templateTypeDropdown = CDropDown.create(container, param);
        }).call(this);
    },

    componentDidMount: function(){
        this.updateJqueryComponent();

        var template = this.state.template;
        this.updateTemplatePanelByIndex(template.type);
    },

    updateTemplatePanel: function(selectedIndex){
        this.updateTemplatePanelByIndex(selectedIndex);
    },

    updateTemplatePanelByIndex: function(index){
        var dom = React.createElement(this.templatePanel[index]);
        ReactDOM.render(dom, this.refs.templatePanel);
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
