import DataTree from './datatree/index';
import MessageBox from 'MessageBox';
import {TableDOM} from 'Table';

import Request from 'Request';
import Project from '../data/project';
import Task from '../data/task';
import Engine from '../data/engine';
import './style.less';
import {API, TableData} from './api';

var StaticalAssistorPopup = React.createClass({
	getInitialState: function() {
        return {
            title: this.props.title,
            tableData: new TableData(),
        };
    },

	getContent: function() {
        var tableData = {
            curve: this.state.tableData
        }
	    return (
	    	<div className='staticalassistorpopup'>
	    		<div className='trees'>
	    			<DataTree ref='tree'/>	
					<DataTree ref='subtree'/>		    			
	    		</div>
				<div className='tableChart'>
					<TableDOM uidata={tableData} isReverse={true}/>
				</div>				
	    	</div>
	    );   
    },
    onTreeNodeClk: function(e, param){
        //data can be cached here. once detail info has been queries, cache it.
        var entity = param.entity;
        if(!entity){ //a click from subtree rather than main tree.
            return;
        }

        var id = entity.id;
        var api, dm2uiHandler;

        if(entity instanceof Project){
            api = `statical/project/${id}`; //todo: backend api.
            dm2uiHandler = API.convertProject2TreeData;
        }else if(entity instanceof Task){
            api = `statical/task/${id}`;
            dm2uiHandler = API.convertTask2TreeData;
        }else if(entity instanceof Engine){
            api = `statical/engine/${id}`;
            dm2uiHandler = API.convertEngine2TreeData;
        }

        Request.getData(Request.getBackendAPI(api)).then((function(param){
            if(param.errCode == -1){
                var obj = param.entity;

                entity.update(obj); 

                var treeData = dm2uiHandler(entity);
                this.refs.subtree.setState({data: treeData});
            }
        }).bind(this)).catch(function(e){
            console.error(e.stack);
        });
    },

    componentWillUnmount: function(){
        API.signal_treeNode_click.unlisten(this.onTreeNodeClk);
    },
    componentDidMount: function(){
        API.signal_treeNode_click.listen(this.onTreeNodeClk);

        Request.getData(Request.getBackendAPI('statical')).then((function(param){
        	if(param.errCode == -1){
        		API.setProjects(param.projects);
        		var projects = API.getProjects();
	        	var treeData = API.convertProjects2TreeData(projects); 
	        	this.refs.tree.setState({data: treeData});
        	}
        }).bind(this)).catch(function(e){
            console.error(e.stack);
        });
    },

	render() {
        var content = this.getContent();
        var title = this.state.title;
        return (<MessageBox cName='staticalPopup' 
        	title={title} 
        	onOK={this.onOK} 
        	ref='msgbox' 
        	children={content} 
        	isShow={true}
            hideFooter={true}/>);
    },
})

module.exports = StaticalAssistorPopup;