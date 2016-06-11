import API from './api.js';

var TaskList = React.createClass({
	getInitialState: function() {
        return {
        }
    },
    onAddTaskBtnClk: function(){
		API.signal_taskpopup_show.dispatch();
    },
    onEditTaskClk: function(){
    	API.signal_taskpopup_show.dispatch();
    },
    render: function() {
        return (
            <div className='taskList'>
				<span className="label label-primary addTaskBtn" onClick={this.onAddTaskBtnClk}>+</span>

				<span className="label label-success task" onClick={this.onEditTaskClk}>EWO</span>
				<span className="label label-info task">Hot Issue</span>
				<span className="label label-warning task">Mule</span>
				<span className="label label-success task">EWO</span>
				<span className="label label-info task">Hot Issue</span>
				<span className="label label-warning task">Mule</span>
				<span className="label label-success task">EWO</span>
				<span className="label label-info task">Hot Issue</span>
				<span className="label label-warning task">Mule</span>
				<span className="label label-success task">EWO</span>
				<span className="label label-info task">Hot Issue</span>
				<span className="label label-warning task">Mule</span>
				<span className="label label-success task">EWO</span>
				<span className="label label-info task">Hot Issue</span>
				<span className="label label-warning task">Mule</span>
				<span className="label label-success task">EWO</span>
				<span className="label label-info task">Hot Issue</span>
				<span className="label label-warning task">Mule</span>
				<span className="label label-success task">EWO</span>
				<span className="label label-info task">Hot Issue</span>
				<span className="label label-warning task">Mule</span>
				<span className="label label-success task">EWO</span>
				<span className="label label-info task">Hot Issue</span>
				<span className="label label-warning task">Mule</span>
				<span className="label label-success task">EWO</span>
            </div>
        );    
    }
});

module.exports = TaskList;


