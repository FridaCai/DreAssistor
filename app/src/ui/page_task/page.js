import CTimeLine from './timeline/index.js';
import TemplateTaskList from './template_task_list.js';
import TaskPopup from './popup_task/index.js';

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
    onTaskPopupShow: function(e, param){
        this.refs.taskpopup.show(param);
    },
    render: function() {
        return (
            <div className='pageTask'>
                <TemplateTaskList/>
                <CTimeLine/>
                <TaskPopup ref='taskpopup'/>
            </div>
        );    
    }
});

module.exports = PageTask;
