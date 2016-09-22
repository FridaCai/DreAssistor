import './style.less';

import DataTree from './tree/index';
import MessageBox from 'MessageBox';
import ButtonGroup from 'ButtonGroup';
import {TableDOM} from 'Table';

import Request from 'Request';
import Project from '../data/project';
import Task from '../data/task';
import Engine from '../data/engine';

import API from './api';
import TreeUIData from './uidata/tree';
import TableUIData from './uidata/table';

var StaticalAssistorPopup = React.createClass({
	getInitialState: function() {
        API.dm2ui();

        return {
            title: this.props.title,
        };
    },

    onTreeDataDragIn: function(){
        API.ui2dm();
        API.dm2ui();
        
        var tableData = {
            curve: API.getTabelUIData()
        }
        this.refs.table.update({
            uidata: tableData
        })
    },

    appendNewTableLLine: function(){
        API.appendNewTableLine();

        API.dm2ui();
        var tableData = {
            curve: API.getTabelUIData()
        }
        this.refs.table.update({
            uidata: tableData
        })
    },
    clearTable: function(){
        API.clearTable();


        API.dm2ui();
        var tableData = {
            curve: API.getTabelUIData()
        }
        this.refs.table.update({
            uidata: tableData
        })
    },
    onTableLineDelete: function(){
        API.ui2dm();

        var tableData = {
            curve: API.getTabelUIData()
        }
        this.refs.table.update({
            uidata: tableData
        })
    },

	getContent: function() {
        var tableData = {
            curve: API.getTabelUIData()
        }
        var btnGroupParam = [{
            value: '新建一列',
            onClick: this.appendNewTableLLine
        },{
            value: '清空数据',
            onClick: this.clearTable
        }];
	    return (
	    	<div className='staticalassistorpopup'>
	    		<div className='trees'>
	    			<DataTree ref='tree'/>	
					<DataTree ref='subtree'/>		    			
	    		</div>
				<div className='tableChart'>
                    <ButtonGroup param={btnGroupParam}/>
					<TableDOM uidata={tableData} isReverse={true} ref='table'/>
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
            dm2uiHandler = TreeUIData.convertProject2TreeData;
        }else if(entity instanceof Task){
            api = `statical/task/${id}`;
            dm2uiHandler = TreeUIData.convertTask2TreeData;
        }else if(entity instanceof Engine){
            api = `statical/engine/${id}`;
            dm2uiHandler = TreeUIData.convertEngine2TreeData;
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
        TableUIData.signal_treedata_dragin.unlisten(this.onTreeDataDragIn);
        TableUIData.signal_line_delete.unlisten(this.onTableLineDelete);
    },
    componentDidMount: function(){
        API.signal_treeNode_click.listen(this.onTreeNodeClk);
        TableUIData.signal_treedata_dragin.listen(this.onTreeDataDragIn);
        TableUIData.signal_line_delete.listen(this.onTableLineDelete);

        Request.getData(Request.getBackendAPI('statical')).then((function(param){
        	if(param.errCode == -1){
        		API.setProjects(param.projects);
        		var projects = API.getProjects();
	        	var treeData = TreeUIData.convertProjects2TreeData(projects); 
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