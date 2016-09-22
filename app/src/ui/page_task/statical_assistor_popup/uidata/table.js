import {Base} from 'Table';
import {Line} from 'Table';
import {Cell} from 'Table';
import Label from 'Label';
import ButtonGroup from 'ButtonGroup';
import LinkButton from '../table/widget/linkbutton/index';
import API from '../api';
import Signal from 'Signal';

class TableData extends Base{
	constructor(){
		super();

		this.header = Line.create({cells: [
			Cell.create({component: Label, v: ''}), 
			Cell.create({component: Label, v: 'X'}), 
			Cell.create({component: Label, v: 'Y1'}), 
			Cell.create({component: Label, v: 'Y2'}), 
		]});
	}
	
	onMove(){

	}
	
	onDelete(){

	}
	
	_getDataComponent(param){
		return Cell.create({
			component: LinkButton, 
			param: {
				value: param.label,
				onClick: function(){
					 //todo: navigate back to tree
				},
				onDragDataIn:function(data){
					this.v = data;
					TableData.signal_treedata_dragin.dispatch();
				}
			},
			v: param
		}) //todo: special btn
	}
	_getHandlerComponent(target){
		var self = this;
		return Cell.create(
			{
				component: ButtonGroup, 
				param: [{
					value: '移动',
					onClick: function(){ //todo: actually, it should be drag and drop
						this.onMove.bind(target)
					}
				}, {
					value: '删除',
					onClick: function(){
						var line = this.line;
						self.deleteLine(line);

						TableData.signal_line_delete.dispatch();
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

TableData.signal_treedata_dragin = new Signal();
TableData.signal_line_delete = new Signal();
module.exports = TableData;


