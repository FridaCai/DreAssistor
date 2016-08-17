import {Cell} from 'Table';
import {Line} from 'Table';
import {Base} from 'Table';
import Signal from 'Signal';
import Label from 'Label';
import ComboBox from 'ComboBox';
import Input from 'Input';
import {ExpandContainerDOM} from 'Table';
import {ExpandCellDOM} from 'Table';
import {ExpandLine} from 'Table';
import MixComponent from '../../widget/mixcomponent.js';


class Sheet4 extends Base{
	constructor(){
		super();

		this.header = Line.create({
			cells: [
				Cell.create({component: Label, v: ''}), 
				Cell.create({component: Label, v: ''})
			]
		});
		this.sheetName = `出气管`;
	}

	ui2dm(benchmark){

	}

	dm2ui(benchmark){
		var expandLine1 = ExpandLine.create({
			cells: [Cell.create({component: ExpandContainerDOM, param: {}})]
		});
		

		this.ui = [//todo. LIne.
			Line.create({cells: [
				Cell.create({component: Label, v: '零件重量'}),
				Cell.create({component: Input, param: {
				    v: 0
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '零件材质'}),
				Cell.create({component: ComboBox, param: {
				    selectedId: "", //string. existed id in options.
				    options: [{
				        id: "0",
				        label: "PPT20",
				    },{
				        id: "1",
				        label: "EPDM",
				    }],
				    prompt: "请选择", //if fail to find item in options by defautlKey, use prompt string.
				    onchange: function(){} //event triggered when selected item change.
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '工艺'}),
				Cell.create({component: ComboBox, param: {
				    selectedId: "", //string. existed id in options.
				    options: [{
				        id: "0",
				        label: "注塑",
				    },{
				        id: "1",
				        label: "吹塑",
				    }],
				    prompt: "请选择", //if fail to find item in options by defautlKey, use prompt string.
				    onchange: function(){} //event triggered when selected item change.
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '零件壁厚'}),
				Cell.create({component: Input, param: {
				    v: 0
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '零件容积'}),
				Cell.create({component: Input, param: {
				    v: 0
				}})
			]}),

			Line.create({cells: [
				Cell.create({component: Label, v: '零件尺寸(长）'}),
				Cell.create({component: Input, param: {
				    v: 0
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '零件尺寸(宽）'}),
				Cell.create({component: Input, param: {
				    v: 0
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '零件尺寸(高）'}),
				Cell.create({component: Input, param: {
				    v: 0
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '高频谐振器'}),
				Cell.create({component: ComboBox, param: {
				    selectedId: "", //string. existed id in options.
				    options: [{
				        id: "0",
				        label: "有",
				    },{
				        id: "1",
				        label: "无",
				    }],
				    prompt: "请选择", //if fail to find item in options by defautlKey, use prompt string.
				    onchange: function(){} //event triggered when selected item change.
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '卡箍(数量）'}),
				Cell.create({component: Input, param: {
				    v: 0
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '卡箍(宽度）'}),
				Cell.create({component: Input, param: {
				    v: 0
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '卡箍(壁厚）'}),
				Cell.create({component: Input, param: {
				    v: 0
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '出气管尺寸'}),
				Cell.create({component: Input, param: {
				    v: 0
				}})
			]}),
			


			Line.create({cells: [
				Cell.create({component: Label, v: '节气门尺寸'}),
				Cell.create({component: Input, param: {
				    v: 0
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: 'PCV Box体积'}),
				Cell.create({component: Input, param: {
				    v: 0
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: 'PCV与MAF之间距离'}),
				Cell.create({component: Input, param: {
				    v: 0
				}})
			]}),



			Line.create({
				cells: [
					Cell.create({component: Label, v: '出气管周边零件间隙'}),
					Cell.create({
						component: ExpandCellDOM, 
						param: {
				        	label: '详情',
				        	isOpen: false, //need?
				        	onExpandToggle: function(){
				        		Sheet4.signal_expand_toggle.dispatch();
				        	},
				        	expandComponent: MixComponent,
				        	expandComponentParam: {
				        		id: 'konglv' //todo. 
				        	}
						}, 
						v:''
					})
				], 
				expandLine: expandLine1
			}),
			expandLine1
		];
	}
}
Sheet4.signal_expand_toggle = new Signal();
module.exports = Sheet4;








