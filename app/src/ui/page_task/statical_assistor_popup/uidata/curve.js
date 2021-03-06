import {Base} from 'Table';
import {Line} from 'Table';
import {Cell} from 'Table';
import Label from 'Label';
import Button from 'Button';
import LinkButton from '../ui/table/widget/linkbutton/index';
import API from '../api';
import Signal from 'Signal';
import DragHandler from '../ui/table/widget/draghandler/index';

class CurveTableUIData extends Base{
	constructor(){
		super();
		this.sheetName = "曲线统计";


		this.header = Line.create({cells: [
			this._getDataComponent({label: 'Drag Data Here!'})
		]});
	}
	
	_getDataComponent(param){
		var self = this;
		var txt = 'Drag Data Here!';


		return Cell.create({
			component: LinkButton, 
			param: {
				value: txt,
				onClick: function(){
					 //todo: navigate back to tree
				},
				dragDataFromTree:function(data){
					CurveTableUIData.signal_treedata_dragin.dispatch(data);
				}
			},
			v: {label: txt}
		})
	}
	ui2dm(dm){
		
	}
	dm2ui(dm){
		this.ui = [];
		dm.map((function(curve, index){
			this.id = curve.id;

			this.ui.push(Line.create({cells: [Cell.create({
					component: Button,
					param: {
						label: "删除",
						onClick: function(){
							CurveTableUIData.signal_curve_delete.dispatch({index: index});
						}
					}
				})]
			}));

			curve.series.map((function(serie){
				var label = serie.label;
				var index = serie.data;

				//todo: color and checkbox.
				var arr = curve.data[index].map(function(value){
					return Cell.create({component: Label, v: value});
				});
				var cells = [Cell.create({component: Label, v: label})].concat(arr);
				this.ui.push(Line.create({cells: cells}));
			}).bind(this));


		}).bind(this));

	}
}

CurveTableUIData.signal_treedata_dragin = new Signal();
CurveTableUIData.signal_curve_delete = new Signal();

module.exports = CurveTableUIData;

