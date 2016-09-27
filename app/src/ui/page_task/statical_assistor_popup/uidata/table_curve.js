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

class CurveTableUIData extends Base{
	constructor(){
		super();
		this.sheetName = "曲线统计";

		this.header = Line.create({cells: [
			Cell.create({component: Label, v: ''}), 
			Cell.create({component: Label, v: 'X'}), 
			Cell.create({component: Label, v: 'Y1'}), 
			Cell.create({component: Label, v: 'Y2'}), 
		]});
	}
	
	
	ui2dm(dm){
		
	}
	dm2ui(dm){
		
	}
}

module.exports = CurveTableUIData;


