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
                    var ft = passFilter(filter, [projectId, spId, child.id]);
                    if(ft){
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
                    
                }
            })
        });
        

        var addOn = React.createElement(AddOn, {
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
                    children={addOn}
                    project = {project}
                    onContextMenu = {this.onContextMenu}/>
                <ContextMenu ref='contextmenu'/>
            </div>
	        
		);
    }
});

module.exports = CTimeLine;
