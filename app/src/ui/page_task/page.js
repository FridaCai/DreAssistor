import CTimeLine from './timeline/index.js';
import TemplateTaskList from './templatetasklist/index.js';
import TaskPopup from './taskpopup/index.js';
import ProjectPopup from './projectpopup/index.js';
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
        API.signal_projectpoup_show.listen(this.onProjectShow);

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
        API.signal_projectpoup_show.listen(this.onProjectShow);
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
            </div>
        );    
    }
});

module.exports = PageTask;
