import CTimeLine from './timeline/index.js';
import TemplateTaskList from './templatetasklist/index.js';
import TaskPopup from './taskpopup/index.js';
import AssistorPanel from './assistorpanel/index.js';

import API from './api.js';
import Util from '../../util.js';

var PageTask = React.createClass({
	getInitialState: function() {
        return {
        }
    },
    componentDidMount: function(){
        API.signal_taskpopup_show.listen(this.onTaskPopupShow);
        API.signal_page_refresh.listen(this.onPageRefresh);

        var url = '/app/res/mockupapi/get_projects.json';
        Util.getData(url).then((function(param){
            if(param.errCode !== -1)
                return;

            API.setProjects(param.projects);

            this.forceUpdate();
        }).bind(this));
    },
    componentDidUnMount: function(){
        API.signal_taskpopup_show.unlisten(this.onTaskPopupShow);
        API.signal_page_refresh.unlisten(this.onPageRefresh);
    },
    onPageRefresh: function(e){
        this.forceUpdate();
    },
    onTaskPopupShow: function(e, param){
        this.refs.taskpopup.show(param);
    },
    render: function() {
        return (
            <div className='pageTask'>
                <TemplateTaskList/>
                <CTimeLine/>
                <AssistorPanel/>
                <TaskPopup ref='taskpopup'/>
            </div>
        );    
    }
});

module.exports = PageTask;
