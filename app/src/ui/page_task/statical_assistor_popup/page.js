
import DataTree from './tree/index';

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


import ConditionPanel from './conditionpanel/index';

import ValueChart from './chart/valuechart';
import CurveChart from './chart/curvechart';

var Content = React.createClass({

    getInitialState: function() {
        API.dm2ui();
        return {};
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
        var sheetIndex = this.refs.table.getSheetIndex();
        var uidata;

        var target;
        switch(sheetIndex){
            case 0:
                var dm = API.getTCDM();
                uidata = CurveUIData.convertDM2CurveData(dm);
                ReactDOM.unmountComponentAtNode(this.refs.chart);    
                target = ReactDOM.render(<ValueChart id='statica_value' uidata={uidata}/>, this.refs.chart);
                break;
            case 1:
                var dm = API.getCurveDM();
                uidata = CurveUIData.convertCurveDM2CurveData(dm);//bad name. convert table curve data to chart data. 
                ReactDOM.unmountComponentAtNode(this.refs.chart);    
                target = ReactDOM.render(<CurveChart id='statica_curve' uidata={uidata}/>, this.refs.chart);
                break;
        }
        target.update({uidata: uidata});
    },
	render: function() {
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
//<Chart ref='chart' id='statical_assistor_popup_curve'/>
	    return (
	    	<div className='staticalassistorpopup'>
	    		<div className='trees'>
                    <ConditionPanel ref='conditionpanel' onOK={this.onSearch} taskType={this.props.taskType}/>
	    			<DataTree ref='tree'/>	
					<DataTree ref='subtree'/>		    			
	    		</div>
				<div className='tableChart'>
                    <Button param={newLineBtnParam}/>
                    <Button param={clearTableBtnParam}/>
					<TableDOM uidata={uidata} ref='table'/>
                    <Button param={drawCurveBtnParam}/>
                    <div ref='chart'></div>
				</div>				
	    	</div>
	    );   
    },

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
        CurveTableUIData.signal_curve_delete.unlisten(this.onCurveDelete);
    },
    componentDidMount: function(){
        API.signal_treeNode_click.listen(this.onTreeNodeClk);
        ValueTableUIData.signal_treedata_dragin.listen(this.onTreeDataDragIn);
        ValueTableUIData.signal_line_delete.listen(this.onTableLineDelete);
        ValueTableUIData.signal_line_move.listen(this.onTableLineMove);

        CurveTableUIData.signal_treedata_dragin.listen(this.onCurveDragIn);
        CurveTableUIData.signal_curve_delete.listen(this.onCurveDelete);



        var param;
        if(this.props.taskType != undefined){
            param = {taskType: this.props.taskType};
        }
        this.callAPI(param);
    },
    onCurveDelete: function(e, param){
        var index = param.index;
        API.curveDelete(index);

        API.dm2ui_curve();

        this.refs.table.update({
            uidata: {
                value: API.getValueTableUIData(),
                curve: API.getCurveTableUIData()
            }
        })
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
    }

})

module.exports = Content;


