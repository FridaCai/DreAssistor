import MessageBox from '../../widget/messagebox.js';
import UploadFileComponent from '../../widget/uploadfile/index.js';
import Util from '../../widget/excel/util.js';
import moment from 'moment';
import Table from './table.js';
import API from '../api.js';
import Project from '../data/project.js';
import GlobalUtil from '../../../util.js';

var ProjectPopup = React.createClass({
	getInitialState: function() {
        return {
            title: this.props.title,
            onOkClk: this.props.onOkClk,
        };
    },
    
    show: function(state) {
    	var newState = state || this.state;
        this.setState(newState, this.updateJqueryComponent);
        this.refs.msgbox.show();
    },

	getContent: function() {
        //todo: send projectObj here.
	    return (
            <Table project={this.props.project} ref='datatable'/>
	    );   
    },
    componentDidMount: function(){
        this.updateJqueryComponent();
        this.refs.msgbox.show();
    },
    updateJqueryComponent: function() {
    	return;
    },

    onOkClk:function() {
        var project = this.refs.datatable.getData();
        this.state.onOkClk(project);
        return Promise.resolve();
    },

    render: function() {
        var content = this.getContent();
        var title = this.state.title;
        return (<MessageBox width={700} title={title} okHandler={this.onOkClk} ref='msgbox' cName='projectPopupContainer' children={content}/>);
    },
});

module.exports = ProjectPopup;


