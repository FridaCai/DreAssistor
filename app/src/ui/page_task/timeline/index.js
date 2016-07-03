import Timeline from './lib/Timeline.jsx';
import moment from 'moment';
import API from '../api.js';
import Util from '../../../util.js';
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
        API.signal_projectpoup_show.dispatch({project: this.props.project});
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
        return {};
    },
 
    onContextMenu: function(param){
        var p = $(this.refs.timeline).offset();
        var left = param.left - p.left;
        var top = param.top - p.top;


        param.left = left;
        param.top = top;

        this.refs.contextmenu.show(param);
    },
    render: function() {
        var project = this.props.project;
        var projectId = project.id;
        var groups = [];

        this.props.project.children.map(function(sp){
            groups.push({
                id: projectId + '_' + sp.id,
                title: sp.label,
                instance: sp,
            })
        })

        var items = [];
        this.props.project.children.map(function(sp){
            var spId = sp.id;
            sp.children.map(function(child){
                if(child instanceof Tag) {
                    items.push({
                        id: projectId + '_' + spId + '_' + child.id,
                        group: projectId + '_' + spId,
                        title: child.label,
                        start_time: child.time,
                        end_time: child.time+1,
                        color: Util.convertIntColorToHex(child.markColor),
                        instance: child,
                    })
                }else if (child instanceof Task){
                    items.push({
                        id: projectId + '_' + spId + '_' + child.id,
                        group: projectId + '_' + spId,
                        title: child.label,
                        start_time: child.startTime,
                        end_time: child.endTime,
                        color: Util.convertIntColorToHex(child.markColor),
                        instance: child,
                    })
                }
            })    
        });
        

        var filter = React.createElement(AddOn, {
            project: this.props.project   
        });
        var sidebarWidth = $(window).width() * 0.2;
        return (
            <div className='timeline' style={{position:'relative'}} ref='timeline'>
                <Timeline groups={groups}
                    items={items}
                    defaultTimeStart={moment().add(-12, 'hour')}
                    defaultTimeEnd={moment().add(12, 'hour')}
                    canMove={true}
                    canResize={true}
                    canChangeGroup={true}
                    useResizeHandle={true}
                    stackItems={true}
                    fixedHeader={'fixed'}
                    sidebarWidth={sidebarWidth}
                    children={filter}
                    project = {project}
                    onContextMenu = {this.onContextMenu}/>
                <ContextMenu ref='contextmenu'/>
            </div>
	        
		);
    }
});

module.exports = CTimeLine;
