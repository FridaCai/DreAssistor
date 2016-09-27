import './style.less';

import DataTree from './tree/index';
import MessageBox from 'MessageBox';
import {TableDOM} from 'Table';

import Request from 'Request';
import Project from '../data/project';
import Task from '../data/task';
import Engine from '../data/engine';

import API from './api';
import TreeUIData from './uidata_tree/tree';
import ValueTableUIData from './uidata/table_value';
import CurveTableUIData from './uidata_curve/curve';
import CurveUIData from './uidata/curve';

import Button from 'Button';
import Checkbox from 'Checkbox';

import Chart from './chart/index';
import ConditionPanel from './conditionpanel/index';

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
        
        this.refs.table.update({
            uidata: {
                value: API.getValueTableUIData(),
                curve: API.getCurveTableUIData()
            }
        })
    },

    appendNewTableLLine: function(){
        API.appendNewTableLine();

        API.dm2ui();
        this.refs.table.update({
            uidata: {
                value: API.getValueTableUIData(),
                curve: API.getCurveTableUIData()
            }
        })
       
    },
    clearTable: function(){
        API.clearTable();


        API.dm2ui();
        this.refs.table.update({
            uidata: {
                value: API.getValueTableUIData(),
                curve: API.getCurveTableUIData()
            }
        })
    },
    onTableLineDelete: function(param){
        var index = param.index;
        API.deleteAt(index);
        API.dm2ui();

        this.refs.table.update({
            uidata: {
                value: API.getValueTableUIData(),
                curve: API.getCurveTableUIData()
            }
        })
    },
    onTableLineMove: function(e, param){
        var {startIndex, endIndex} = param;
        API.move(startIndex, endIndex);
        API.dm2ui();
        this.refs.table.update({
            uidata: {
                value: API.getValueTableUIData(),
                curve: API.getCurveTableUIData()
            }
        })
        
    },
    drawCurve: function(){
        var dm = API.getTCDM();
        var uidata = CurveUIData.convertDM2CurveData(dm);
        this.refs.chart.update({uidata: uidata});
    },
	getContent: function() {
        var uidata = {
            value: API.getValueTableUIData(),
            curve: API.getCurveTableUIData()
        };
        var newLineBtnParam = {
            label: '新建一列',
            onClick: this.appendNewTableLLine    
        };
        var clearTableBtnParam = {
            label: '清空数据',
            onClick: this.clearTable    
        };
        var batchOperationCheckboxParam = {
            isCheck: false,
            label: '批处理',
            onChange: function(){}
        }
        var drawCurveBtnParam = {
            label: '画曲线',
            onClick: this.drawCurve
        }

	    return (
	    	<div className='staticalassistorpopup'>
	    		<div className='trees'>
                    <ConditionPanel ref='conditionpanel' onOK={this.onSearch}/>
	    			<DataTree ref='tree'/>	
					<DataTree ref='subtree'/>		    			
	    		</div>
				<div className='tableChart'>
                    <Button param={newLineBtnParam}/>
                    <Button param={clearTableBtnParam}/>
					<TableDOM uidata={uidata} ref='table'/>
                    <Button param={drawCurveBtnParam}/>
                    <Chart ref='chart' id='statical_assistor_popup_curve'/>
				</div>				
	    	</div>
	    );   
    },
/*<TableDOM uidata={uidata} ref='table' onDrop={this.onTreeDataDragInTable}/>*/

/*
    onTreeDataDragInTable: function(dataTransfer){
        var transferText = dataTransfer.getData('text');
        if(!transferText)
            return;

        var obj = JSON.parse(transferText);
        if(obj.data.component != 'curve'){
            return;
        }

        var curve = obj.data.curve;

        if(Util.isUUID(curve.id)){
            return;
        }

        

        //todo: 
        //save and load curve.
        //query curve data and updata curve.

        //todo.
        //append new table sheet.
        //obtain curve data.
    },
*/



    onSearch: function(param){
        this.callAPI(param);
    },
    
    onTreeNodeClk: function(e, param){
        //data can be cached here. once detail info has been queries, cache it.
        var entity = param.entity;
        if(!entity)
            return;


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
        }else{
            return;
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
        ValueTableUIData.signal_treedata_dragin.unlisten(this.onTreeDataDragIn);
        ValueTableUIData.signal_line_delete.unlisten(this.onTableLineDelete);
        ValueTableUIData.signal_line_move.unlisten(this.onTableLineMove);

        CurveTableUIData.signal_treedata_dragin.unlisten(this.onCurveDragIn);
    },
    componentDidMount: function(){
        API.signal_treeNode_click.listen(this.onTreeNodeClk);
        ValueTableUIData.signal_treedata_dragin.listen(this.onTreeDataDragIn);
        ValueTableUIData.signal_line_delete.listen(this.onTableLineDelete);
        ValueTableUIData.signal_line_move.listen(this.onTableLineMove);

        CurveTableUIData.signal_treedata_dragin.listen(this.onCurveDragIn);

        this.callAPI();
    },
    
    onCurveDragIn: function(e, param){
        var curveId = param.curve.id;

        API.loadCurve(curveId).then((function(result){
            if(result.errCode == -1){
                //var curve = Curve.create(result.curve);
                API.dragNewCurve(result.curve);

                API.dm2ui_curve();

                this.refs.table.update({
                    uidata: {
                        value: API.getValueTableUIData(),
                        curve: API.getCurveTableUIData()
                    }
                })
            }
        }).bind(this), function(e){
            throw e;
        }).catch(function(e){
          console.error(e.stack);
        });
    },


    callAPI: function(param){
        param = param || {};
        Request.getData(Request.getBackendAPI('statical'), param).then((function(param){
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