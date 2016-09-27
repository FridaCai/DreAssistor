import {Base} from 'Table';
import {Line} from 'Table';
import {Cell} from 'Table';
import Label from 'Label';
import Group from 'Group';
import Button from 'Button';
import LinkButton from '../table/widget/linkbutton/index';
import API from '../api';
import Signal from 'Signal';
import DragHandler from '../table/widget/draghandler/index';

class ValueTableUIData extends Base{
	constructor(){
		super();
		this.sheetName = "数值统计";

		this.reset();
	}
	reset(){
		this.ui = [
			Line.create({cells: [
				Cell.create({component: Label, v: ''}), 
				this._getHandlerComponent(),
			]}),
			Line.create({
				cells: [
					Cell.create({component: Label, v: 'X'}),
					this._getDataComponent({label: '', path:''}, 0)
				]
			}),
			Line.create({
				cells: [
					Cell.create({component: Label, v: 'Y1'}),
					this._getDataComponent({label: '', path:''}, 0)
				]
				
			}),
			Line.create({
				cells: [
					Cell.create({component: Label, v: 'Y2'}),
					this._getDataComponent({label: '', path:''}, 0)
				]
			})
		]
	}

	_getDataComponent(param, index){
		var self = this;
		return Cell.create({
			component: LinkButton, 
			param: {
				value: param.label,
				onClick: function(){
					 //todo: navigate back to tree
				},
				dragDataFromTree:function(data){
					if(data.component === 'curve'){
						return; 
					}
					this.v = data;
					ValueTableUIData.signal_treedata_dragin.dispatch();
				},
				dragDataFromDragHandler: function(data){
					var startIndex = data.index;
					var endIndex = index;

					ValueTableUIData.signal_line_move.dispatch({startIndex:startIndex, endIndex:endIndex});
				}
			},
			v: param
		}) //todo: special btn
	}
	_getHandlerComponent(i){
		var self = this;
		return Cell.create(
			{
				component: Group, 
				param: [{
					component: DragHandler,
					param: {
						label: '移动',
						onDragStart: function(e){
							var line = this.line;
							var obj = {
								target: 'draghandler',
								data: {
									index:i
								}
							}
							e.dataTransfer.setData("text", JSON.stringify(obj));
						}
					}
				}, {
					component: Button,
					param: {
						label: '删除',
						onClick: function(){
							ValueTableUIData.signal_line_delete.dispatch({index:i});
						}	
					}
				}]
			}
		)
	}

	
	ui2dm(dm){
		dm.clear();

		var loop = this.ui[0].cells.length;
		for(var i=1; i<loop; i++){
			var xCell = this.ui[1].cells[i].getValue();
			var y1Cell = this.ui[2].cells[i].getValue();
			var y2Cell = this.ui[3].cells[i].getValue();

			dm.insert({
				xCell: xCell,
				y1Cell: y1Cell,
				y2Cell: y2Cell
			});
		}
	}
	dm2ui(dm){
		var sheet = dm.sheets[0];
		var loop = sheet.x.length;

		var handler = [Cell.create({component: Label, v: ''})];
		var xArr = [Cell.create({component: Label, v: 'X'})];
		var y1Arr = [Cell.create({component: Label, v: 'Y1'})];
		var y2Arr = [Cell.create({component: Label, v: 'Y2'})];


		for(var i=0; i<loop; i++){
			handler.push(this._getHandlerComponent(i));
			xArr.push(this._getDataComponent(sheet.x[i], i));
			y1Arr.push(this._getDataComponent(sheet.y1[i], i));
			y2Arr.push(this._getDataComponent(sheet.y2[i], i));
		}	

		this.ui = [
			Line.create({cells: handler}),
			Line.create({cells: xArr}),
			Line.create({cells: y1Arr}),
			Line.create({cells: y2Arr})
		];
			
	}
}

ValueTableUIData.signal_treedata_dragin = new Signal();
ValueTableUIData.signal_line_delete = new Signal();
ValueTableUIData.signal_line_move = new Signal();

module.exports = ValueTableUIData;


