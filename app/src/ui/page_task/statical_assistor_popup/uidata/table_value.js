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

		this.header = Line.create({cells: [
			Cell.create({component: Label, v: ''}), 
			Cell.create({component: Label, v: 'X'}), 
			Cell.create({component: Label, v: 'Y1'}), 
			Cell.create({component: Label, v: 'Y2'}), 
		]});
	}
	
	getLinePos(line){
		var pos;
		this.ui.map(function(_line, index){
			if(line.id === _line.id){
				pos = index;
			}
		})
		return pos;
	}
	findLineById(lineId){
		return this.ui.find(function(_line){
			return lineId === _line.id;
		})
	}

	deleteLine(line){
		var pos = this.getLinePos(line);
		this.ui.splice(pos, 1);
	}
	insertLineBefore(line, posLine){
		var pos = this.getLinePos(posLine);
		this.ui.splice(pos, 0, line); 
	}
	_getDataComponent(param){
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
					var dragStartLineId = data.lineId;

					var dragStartLine = self.findLineById(dragStartLineId);
					var dragEndLine = this.line;
					
					self.deleteLine(dragStartLine);
					self.insertLineBefore(dragStartLine, dragEndLine);

					ValueTableUIData.signal_line_move.dispatch();
				}
			},
			v: param
		}) //todo: special btn
	}
	_getHandlerComponent(target){
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
									lineId: line.id
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
							var line = this.line;
							self.deleteLine(line);

							ValueTableUIData.signal_line_delete.dispatch();
						}	
					}
				}]
			}
		)
	}

	deleteLine(line){
		this.ui = this.ui.filter(function(l){
			if(l.id === line.id){
				return false;
			}else return true;
		})
	}
	dump(){
		super.dump();
	}
	ui2dm(dm){
		if(this.ui.length === 0){
			dm.reset();
			return;			
		}

		dm.clear();
		this.ui.map((function(line, index){
			var xCell = line.cells[1].getValue();
			var y1Cell = line.cells[2].getValue();
			var y2Cell = line.cells[3].getValue();

			dm.insert({
				xCell: xCell,
				y1Cell: y1Cell,
				y2Cell: y2Cell
			});
		}).bind(this));
	}
	dm2ui(dm){
		this.ui.length=0;
		dm.sheets.map((function(sheet, index){
			if(index === 0){
				var loop = sheet.x.length;
				for(var i=0; i<loop; i++){
					var x = sheet.x[i];
					var y1 = sheet.y1[i];
					var y2 = sheet.y2[i];

					var line = Line.create({cells:[
						this._getHandlerComponent(),
						this._getDataComponent({label: x.label, path: x.path}),
						this._getDataComponent({label: y1.label, path: y1.path}),
						this._getDataComponent({label: y2.label, path: y2.path})
					]});


					this.ui.push(line);
				}	
			}
			
		}).bind(this));
	}
}

ValueTableUIData.signal_treedata_dragin = new Signal();
ValueTableUIData.signal_line_delete = new Signal();
ValueTableUIData.signal_line_move = new Signal();

module.exports = ValueTableUIData;


