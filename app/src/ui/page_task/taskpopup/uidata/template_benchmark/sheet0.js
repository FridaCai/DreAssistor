import {Cell} from 'Table';
import {Line} from 'Table';
import {Base} from 'Table';
import Signal from 'Signal';
import Label from 'Label';
import ComboBox from 'ComboBox';
import Input from 'Input';

class Sheet0 extends Base{
	constructor(){
		super();

		this.header = Line.create({
			cells: [
				Cell.create({component: Label, v: ''}), 
				Cell.create({component: Label, v: ''})
			]
		});
		this.sheetName = `整车级`;
	}

	ui2dm(benchmark){
	    /*for(var i=0; i<this.ui.length; i++){
	        var line = this.ui[i];
	        var key = line.getCellAt(0).getValue();
	        var value = line.getCellAt(1).getValue();

	        switch(key){
	            case 'label':
	            case 'ec':
	                project[key] = value;
	                break;
	            case 'bpMax':
	            case 'bpMin':
	            case 'massMin':
	            case 'massMax':
	                project[key] = Math.round(parseFloat(value) * 100) / 100;
	                break;
	            case 'sorp':
	                project[key] = ExcelUtil.convertYYYYMMDD2UnixTime(value);
	        }
	    }*/
	}

	dm2ui(benchmark){
		
		this.ui = [//todo. LIne.
			Line.create({cells: [
				Cell.create({component: Label, v: '品牌'}),
				Cell.create({component: ComboBox, param: {
				    selectedId: "", //string. existed id in options.
				    options: [{
				        id: "0",
				        label: "大众",
				    },{
				        id: "1",
				        label: "雪弗兰",
				    },{
				        id: "2",
				        label: "别克",
				    }],
				    prompt: "请选择", //if fail to find item in options by defautlKey, use prompt string.
				    onchange: function(){} //event triggered when selected item change.
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '车型'}),
				Cell.create({component: ComboBox, param: {
				    selectedId: "", //string. existed id in options.
				    options: [{
				        id: "0",
				        label: "大众车型A",
				    },{
				        id: "1",
				        label: "大众车型B",
				    },{
				        id: "2",
				        label: "别克车型A",
				    },{
				        id: "3",
				        label: "别克车型B",
				    }],
				    prompt: "请选择", //if fail to find item in options by defautlKey, use prompt string.
				    onchange: function(){} //event triggered when selected item change.
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '配置型号（车型年）'}),
				Cell.create({component: ComboBox, param: {
				    selectedId: "", //string. existed id in options.
				    options: [{
				        id: "0",
				        label: "大众车型A车型年",
				    },{
				        id: "1",
				        label: "大众车型B车型年",
				    },{
				        id: "2",
				        label: "别克车型A车型年",
				    },{
				        id: "3",
				        label: "别克车型B车型年",
				    }],
				    prompt: "请选择", //if fail to find item in options by defautlKey, use prompt string.
				    onchange: function(){} //event triggered when selected item change.
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '官方指导价'}),
				Cell.create({component: ComboBox, param: {
				    selectedId: "", //string. existed id in options.
				    options: [{
				        id: "0",
				        label: "官方指导价1",
				    },{
				        id: "1",
				        label: "官方指导价2",
				    }],
				    prompt: "请选择", //if fail to find item in options by defautlKey, use prompt string.
				    onchange: function(){} //event triggered when selected item change.
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '车体形式'}),
				Cell.create({component: ComboBox, param: {
				    selectedId: "", //string. existed id in options.
				    options: [{
				        id: "0",
				        label: "车体形式1",
				    },{
				        id: "1",
				        label: "车体形式2",
				    }],
				    prompt: "请选择", //if fail to find item in options by defautlKey, use prompt string.
				    onchange: function(){} //event triggered when selected item change.
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '车型级别'}),
				Cell.create({component: ComboBox, param: {
				    selectedId: "", //string. existed id in options.
				    options: [{
				        id: "0",
				        label: "车型级别1",
				    },{
				        id: "1",
				        label: "车型级别2",
				    }],
				    prompt: "请选择", //if fail to find item in options by defautlKey, use prompt string.
				    onchange: function(){} //event triggered when selected item change.
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '发动机排量'}),
				Cell.create({component: Input, param: {
				    value: 0
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '进气形式'}),
				Cell.create({component: ComboBox, param: {
				    selectedId: "", //string. existed id in options.
				    options: [{
				        id: "0",
				        label: "自然吸气",
				    },{
				        id: "1",
				        label: "涡轮增压",
				    },{
				        id: "2",
				        label: "涡轮增压+机械增压",
				    }],
				    prompt: "请选择", //if fail to find item in options by defautlKey, use prompt string.
				    onchange: function(){} //event triggered when selected item change.
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '进气形式'}),
				Cell.create({component: ComboBox, param: {
				    selectedId: "", //string. existed id in options.
				    options: [{
				        id: "0",
				        label: "自然吸气",
				    },{
				        id: "1",
				        label: "涡轮增压",
				    },{
				        id: "2",
				        label: "涡轮增压+机械增压",
				    }],
				    prompt: "请选择", //if fail to find item in options by defautlKey, use prompt string.
				    onchange: function(){} //event triggered when selected item change.
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '气缸排列形式'}),
				Cell.create({component: ComboBox, param: {
				    selectedId: "", //string. existed id in options.
				    options: [{
				        id: "0",
				        label: "L",
				    },{
				        id: "1",
				        label: "V",
				    }],
				    prompt: "请选择", //if fail to find item in options by defautlKey, use prompt string.
				    onchange: function(){} //event triggered when selected item change.
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '气缸数'}),
				Cell.create({component: ComboBox, param: {
				    selectedId: "", //string. existed id in options.
				    options: [{
				        id: "0",
				        label: "3",
				    },{
				        id: "1",
				        label: "4",
				    },{
				        id: "1",
				        label: "6",
				    },{
				        id: "1",
				        label: "8",
				    },{
				        id: "1",
				        label: "10",
				    }],
				    prompt: "请选择", //if fail to find item in options by defautlKey, use prompt string.
				    onchange: function(){} //event triggered when selected item change.
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '最大马力（Ps）'}),
				Cell.create({component: Input, param: {
				    value: 0
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '最大功率（KW）'}),
				Cell.create({component: Input, param: {
				    value: 0
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '最大功率转速（rpm）'}),
				Cell.create({component: Input, param: {
				    value: 0
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '最大扭矩（N.m）'}),
				Cell.create({component: Input, param: {
				    value: 0
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '最大扭矩转速（rpm）'}),
				Cell.create({component: Input, param: {
				    value: 0
				}})
			]}),














			Line.create({cells: [
				Cell.create({component: Label, v: '拆解时间'}),
				Cell.create({component: ComboBox, param: {
				    selectedId: "", //string. existed id in options.
				    options: [{
				        id: "0",
				        label: "2000",
				    },{
				        id: "1",
				        label: "2001",
				    },{
				        id: "2",
				        label: "2002",
				    },{
				        id: "3",
				        label: "2003",
				    },{
				        id: "4",
				        label: "2004",
				    },{
				        id: "5",
				        label: "2005",
				    },{
				        id: "6",
				        label: "2006",
				    },{
				        id: "7",
				        label: "2007",
				    },{
				        id: "8",
				        label: "2008",
				    },{
				        id: "9",
				        label: "2009",
				    },{
				        id: "10",
				        label: "2010",
				    },{
				        id: "11",
				        label: "2011",
				    },{
				        id: "12",
				        label: "2012",
				    },{
				        id: "13",
				        label: "2013",
				    },{
				        id: "14",
				        label: "2014",
				    },{
				        id: "15",
				        label: "2015",
				    },{
				        id: "16",
				        label: "2016",
				    }],
				    prompt: "请选择", //if fail to find item in options by defautlKey, use prompt string.
				    onchange: function(){} //event triggered when selected item change.
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '与SGM对标车型'}),
				Cell.create({component: ComboBox, param: {
				    selectedId: "", //string. existed id in options.
				    options: [{
				        id: "0",
				        label: "与SGM对标车型A",
				    },{
				        id: "1",
				        label: "与SGM对标车型B",
				    }],
				    prompt: "请选择", //if fail to find item in options by defautlKey, use prompt string.
				    onchange: function(){} //event triggered when selected item change.
				}})
			]}),

			Line.create({cells: [
				Cell.create({component: Label, v: '整车数模号'}),
				Cell.create({component: Input, param: {
				    value: ""
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '进气系统数模号'}),
				Cell.create({component: Input, param: {
				    value: ""
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '供应商'}),
				Cell.create({component: Input, param: {
				    value: ""
				}})
			]}),
			Line.create({cells: [
				Cell.create({component: Label, v: '设计亮点'}),
				Cell.create({component: Input, param: {
				    value: ""
				}})
			]})
		];
	}
}
module.exports = Sheet0;








