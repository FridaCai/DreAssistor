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
            <Table projectObj={null} ref='datatable'/>
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
        //has login? if not, return.
        var projectObj = this.refs.datatable.getData();
        
        var project = new Project();
        project.init($.extend(true, {id: GlobalUtil.generateUUID()}, projectObj)); //append creatorID.
        API.getProjects().add(project);

        API.signal_page_refresh.dispatch();
        return Promise.resolve();
    },
    render: function() {
        var content = this.getContent();
        var title = this.state.title;
        return (<MessageBox width={700} title={title} okHandler={this.onOkClk} ref='msgbox' children={content}/>);
    },
});

module.exports = ProjectPopup;


