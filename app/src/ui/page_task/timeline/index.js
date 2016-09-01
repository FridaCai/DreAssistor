import Timeline from './lib/Timeline.jsx';
import moment from 'moment';
import API from '../api.js';
import Util from 'Util';
import Signal from '../../../signal.js';
import Task from '../data/task.js';
import Tag from '../data/tag.js';
import ContextMenu from '../contextmenu.jsx';

var AddOn = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        
    },
    onSort: function() {

    },
    onFilter: function() {

    },
    onAdd: function() {
        //API.signal_addProjectPopup_show.dispatch();
    },
    onProjectClk: function(){
        API.signal_projectpoup_show.dispatch({
            project: this.props.project,
            title:'编辑项目',
            onOK: (function(project){
                var projectObj = project.dump();
                this.props.project.update(projectObj);
                API.signal_page_refresh.dispatch();    
            }).bind(this),
        });
    },
    render: function() {
        var project = this.props.project;
        return (
            <div>
                <div onClick={this.onProjectClk}>
                    <h3>{project.label}</h3>
                </div>
            </div>
            
        )
    }
});


var CTimeLine = React.createClass({
	getInitialState: function() {
        return {
            project: this.props.project,
            filter: this.props.filter,
        };
    },
 
    onContextMenu: function(param){
        var p = $(this.refs.timeline).offset();
        var left = param.left - p.left;
        var top = param.top - p.top;


        param.left = left;
        param.top = top;

        this.refs.contextmenu.show(param);
    },
    componentWillReceiveProps: function(nextprops) {
        this.setState({
            project: nextprops.project,
            filter: nextprops.filter,
        })
    },  


    render: function() {
        var passFilter = function(filter, ids){
            if(!filter)
                return true;

            var target = filter;

            for(var i=0; i<ids.length; i++){
                var target = target[ids[i]];
                if(!target)
                    return false; 
            }

            return target ? true : false;
        }


        var project= this.state.project;
        var projectId = project.id;
        var filter = this.state.filter;

        var fp = passFilter(filter, [projectId]);
        if(!fp) return null;
        
        var groups = [
            {
                id: projectId + '_tag',
                title: 'Master Timing',
                instance: project.tags,
            },
            {
                id: projectId + '_task',
                title: 'AIS Development',
                instance: project.tasks,
            }
        ];


        var items = [];
        project.tags.map(function(tag){
            var tagTime = API.getTagTime(tag);
            items.push({
                id: projectId + '_tag_' + tag.id,
                group: projectId + '_tag',
                title: tag.label,
                start_time: tagTime,
                end_time: tagTime + 1,
                color: Util.convertIntColorToHex(tag.markColor),
                instance: tag,
            })
        })
        project.tasks.map(function(task){
            //var ft = passFilter(filter, [projectId, spId, task.id]);
            //if(ft){
            items.push({
                id: projectId + '_task_' + task.id,
                group: projectId + '_task',
                title: task.label,
                start_time: task.startTime,
                end_time: task.endTime,
                color: Util.convertIntColorToHex(task.markColor),
                instance: task,
            })    
            //}
        })




        var addOn = React.createElement(AddOn, {
            project: this.props.project   
        });
        var sidebarWidth = $(window).width() * 0.2;
        return (
            <div className='timeline' style={{position:'relative', clear:'both'}} ref='timeline'>
                <Timeline groups={groups}
                    items={items}
                    defaultTimeStart={moment().add(-12, 'hour')}
                    defaultTimeEnd={moment().add(12, 'hour')}
                    canMove={true}
                    canResize={true}
                    canChangeGroup={true}
                    useResizeHandle={true}
                    stackItems={true}
                    fixedHeader={'none'}
                    sidebarWidth={sidebarWidth}
                    children={addOn}
                    project = {project}
                    onContextMenu = {this.onContextMenu}/>
                <ContextMenu ref='contextmenu'/>
            </div>
	        
		);
    }
});

module.exports = CTimeLine;
