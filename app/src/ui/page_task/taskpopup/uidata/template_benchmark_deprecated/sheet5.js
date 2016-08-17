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
import Image from 'Image';
import AttachmentList from 'AttachmentList';
import CurveComponent from '../../../../component_curve/index.js';


class Sheet5 extends Base{
	constructor(){
		super();

		this.header = Line.create({
			cells: [
				Cell.create({component: Label, v: ''}),
				Cell.create({component: Label, v: ''}), 
				Cell.create({component: Label, v: ''}),
				Cell.create({component: Label, v: ''}),
				Cell.create({component: Label, v: ''}),
			]
		});
		this.sheetName = `性能`;
	}

	ui2dm(benchmark){

	}

	dm2ui(benchmark){
		var paramLabel = ['压力降', '系统模态', '进气口噪音', 
			'辐射噪音', '过滤效率', '容尘量', 
			'滤芯泄漏量', '减震垫动刚度', '支点动刚度', 
			'拉拔力', '传递损失', '插入损失'];

		paramLabel.map((function(label, index){
			var expandLine = ExpandLine.create({
				cells: [Cell.create({component: ExpandContainerDOM, param: {}})]
			});

			var line = Line.create({
				cells: [
					Cell.create({component: Label, v: label}),
					Cell.create({component: Input, param: {
					    v: 0
					}}),

					Cell.create({
						component: ExpandCellDOM, 
						param: {
				        	label: '导入Excel',
				        	isOpen: false, //need?
				        	onExpandToggle: function(){
				        		Sheet5.signal_expand_toggle.dispatch();
				        	},
				        	expandComponent: CurveComponent,
				        	expandComponentParam: {
				        		id: `performance_${index}_0`
				        	}
						}, 
						v:''
					}),

					Cell.create({
						component: ExpandCellDOM, 
						param: {
				        	label: '附件',
				        	isOpen: false, //need?
				        	onExpandToggle: function(){
				        		Sheet5.signal_expand_toggle.dispatch();
				        	},
				        	expandComponent: AttachmentList,
				        	expandComponentParam: {
				        		id: `performance_${index}_1`
				        	}
						}, 
						v:''
					}),

					Cell.create({
						component: ExpandCellDOM, 
						param: {
				        	label: '图片',
				        	isOpen: false, //need?
				        	onExpandToggle: function(){
				        		Sheet5.signal_expand_toggle.dispatch();
				        	},
				        	expandComponent: Image,
				        	expandComponentParam: {
				        		id: `performance_${index}_2`
				        	}
						}, 
						v:''
					})
				],
				expandLine: expandLine
			});

			this.ui.push(line);
			this.ui.push(expandLine);
		}).bind(this))
	}
}
Sheet5.signal_expand_toggle = new Signal();
module.exports = Sheet5;








