import NormalTemplate from './template_normal.js';
import HotIssueTemplate from './template_multiplesheet.js';
import EWOTemplate from './template_ewo.js';

import MuleMRDTemplate from './template_multiplesheet.js';
import IVTuningTemplate from './template_multiplesheet.js';
import HardToolingTemplate from './template_multiplesheet.js';
import PPVMRDTemplate from './template_multiplesheet.js';
import BenchmarkTemplate from './template_multiplesheet.js';

import TemplateFactory from '../data/template/factory.js';

var TaskTemplatePanel = React.createClass({
    templatePanel: [NormalTemplate, 
        EWOTemplate, 
        HotIssueTemplate, 
        MuleMRDTemplate, 
        IVTuningTemplate,
        HardToolingTemplate,
        PPVMRDTemplate,
        BenchmarkTemplate],
    dom: undefined,

    getInitialState: function() {
        return {
            type: this.props.template.type,
            param: {
                sheetNames: this.props.template.sheetNames,
                sheets: this.props.template.sheets.map(function(multipleParam){
                    return multipleParam.clone();
                })
            },
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

        return TemplateFactory.create({
            type: type, 
            sheets: param.sheets,
            sheetNames: param.sheetNames
        })
    },
    render: function(){
        return (
            <div ref='templatePanel' className='templatePanel'></div>
        )
    }
});
module.exports = TaskTemplatePanel;
