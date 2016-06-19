import CTimeLine from './timeline/index.js';
import TemplateTaskList from './templatetasklist/index.js';
import TaskPopup from './taskpopup/index.js';
import ProjectPopup from './projectpopup/index.js';
import AssistorPanel from './assistorpanel/index.js';
import ContextMenu from './contextmenu.jsx';

import API from './api.js';
import Util from '../../util.js';
import Task from './data/task.js';
import Project from './data/project.js';

var PageTask = React.createClass({
	getInitialState: function() {
        return {
        }
    },

    onTaskCreate: function(e, param){
        var templateTask = API.getTemplateTasks().find(param.templateTaskId);

        var taskObj = $.extend({}, templateTask);
        taskObj = $.extend(taskObj, {   
            id: Util.generateUUID(),
            startTime: param.startTime,
            endTime: param.endTime,
        });
        var task = new Task();
        task.init(taskObj);

        var row = param.row;
        var subproject = param.project.findChildByIndex(row);
        subproject.addChild(task);
        this.forceUpdate();
    },

    componentDidMount: function(){
        API.signal_taskpopup_show.listen(this.onTaskPopupShow);
        API.signal_page_refresh.listen(this.onPageRefresh);
        API.signal_projectpoup_show.listen(this.onProjectShow);
        API.signal_timeline_task_create.listen(this.onTaskCreate);
        API.signal_timeline_contextmenu_show.listen(this.onContextMenuShow);

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
        API.signal_projectpoup_show.unlisten(this.onProjectShow);
        API.signal_timeline_task_create.unlisten(this.onTaskCreate);
        API.signal_timeline_contextmenu_show.unlisten(this.onContextMenuShow);
    },
    onPageRefresh: function(e){
        this.forceUpdate();
    },
    onTaskPopupShow: function(e, param){
        this.refs.taskpopup.show(param);
    },
    onProjectShow: function(e, param){
        this.refs.projectpopup.show(param);
    },
    onContextMenuShow: function(e, param) {
        this.refs.contextmenu.show(param);
    },
    render: function() {
        return (
            <div className='pageTask'>
                <TemplateTaskList/>
                {
                    API.getProjectArr().map(function(project){
                        return (
                            <CTimeLine project={project} key={project.id}/>
                        )
                    })
                }
                
                <AssistorPanel/>
                <TaskPopup ref='taskpopup'/>
                <ProjectPopup ref='projectpopup'/>
                <ContextMenu ref='contextmenu'/>
            </div>
        );    
    }
});

module.exports = PageTask;
