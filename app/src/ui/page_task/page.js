import CTimeLine from './timeline.js';
import TaskList from './list_task.js';
import TaskPopup from './popup_task.js';

import API from './api.js';

var PageTask = React.createClass({
	getInitialState: function() {
        return {
        }
    },
    componentDidMount: function(){
        API.signal_taskpopup_show.listen(this.onTaskPopupShow);
    },
    componentDidUnMount: function(){
        API.signal_taskpopup_show.unlisten(this.onTaskPopupShow);
    },
    onTaskPopupShow: function(){
        this.refs.taskpopup.show();
    },
    render: function() {
        return (
            <div className='pageTask'>
                <TaskList/>
                <CTimeLine/>

                <TaskPopup ref='taskpopup'/>
            </div>
        );    
    }
});

module.exports = PageTask;
