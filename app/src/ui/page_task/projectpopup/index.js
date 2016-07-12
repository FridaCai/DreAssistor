import MessageBox from '../../widget/messagebox.js';
import UploadFileComponent from '../../widget/uploadfile/index.js';
import Util from '../../widget/excel/util.js';
import moment from 'moment';
import Table from './table.js';

var ProjectPopup = React.createClass({
	getInitialState: function() {
        return {
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
            <Table projectObj={null}/>
	    );   
    },

    updateJqueryComponent: function() {
    	return;
    },

    onOkClk:function() {
        return Promise.resolve();
    },
    render: function() {
        var content = this.getContent();
        var title = this.state.title;
        return (<MessageBox width={700} title={title} okHandler={this.onOkClk} ref='msgbox' children={content}/>);
    },
});

module.exports = ProjectPopup;


