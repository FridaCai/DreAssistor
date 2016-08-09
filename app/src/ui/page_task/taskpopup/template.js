import CDropDown from 'CDropDown';
import NormalTemplate from './template_normal.js';
import HotIssueTemplate from './template_hotissue.js';
import EWOTemplate from './template_ewo.js';
import MuleMRDTemplate from './template_mule_mrd.js';
import IVTuningTemplate from './template_mule_mrd.js';


var TaskTemplatePanel = React.createClass({
    templatePanel: [NormalTemplate, EWOTemplate, HotIssueTemplate, MuleMRDTemplate, IVTuningTemplate],
    dom: undefined,

    getInitialState: function() {
        return {
            type: this.props.template.type,
            param: $.extend(true, {}, this.props.template.param),
            project: this.props.project,
        }
    },

    componentDidMount: function(){
        var type = this.state.type;
        this.updateTemplatePanelByIndex(type);
    },
    componentWillUnmount: function(){
        var result = ReactDOM.unmountComponentAtNode(this.refs.templatePanel);
    },

    updateTemplatePanelByIndex: function(index){
        var el = React.createElement(this.templatePanel[index], {param: this.state.param, project: this.state.project});
        this.dom = ReactDOM.render(el, this.refs.templatePanel);
    },
    getValue: function(){
        var type = this.state.type;
        var param = this.dom.getValue();

        return {
            type: type,
            param: param,
        }
    },
    render: function(){
        return (
            <div ref='templatePanel' className='templatePanel'></div>
        )
    }
});
module.exports = TaskTemplatePanel;
