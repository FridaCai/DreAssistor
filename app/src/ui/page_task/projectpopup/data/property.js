import {ExcelUtil} from 'XlsIExport';
import {Cell} from 'Table';
import {Line} from 'Table';
import {Base} from 'Table';
import Signal from 'Signal';
import Label from 'Label';
import Input from 'Input';

class Property extends Base{
	constructor(){
		super();

		this.header = Line.create({
			cells: [
				Cell.create({component: Label, v: 'property'}), 
				Cell.create({component: Label, v: 'value'})
			]
		});
		this.sheetName = `项目属性`;
	}

	ui2dm(project){
	    for(var i=0; i<this.ui.length; i++){
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
	    }
	}

	dm2ui(project){
		//todo: refactor.
		var cells = [];
		Object.keys(project).map(function(key){
			var property = project[key];

			switch(key){
				case 'engines':
					cells.push(Cell.create({
						component: Label,
						v: 'This is a button to add engine'
					}))
					//a new engine.
					break;
				case 'children':
					//do nothing
					break;
				case 'sorp': //timestamp
					var sorp = ExcelUtil.convertUnixTime2YYYYMMDD(project['sorp']);
					cells.push({
						component: Input,
						param:{
							value:sorp
						}
					})					
					break;
				//case '': //curve case
				default:
					cells.push( 
						Cell.create({
							component: Label,
							v: property.label,
						}),
						Cell.create({
							component: Input,
							param: {
								value: property.input,
								onBlur: function(){},
								onChange: function(){}
							}
						})
					);
					break;
			}
		})

		var line = Line.create({
			cells: cells,
		})
		this.ui.push(line);


		









/*
		var label = project['label'];
		var bpMax = project['bpMax'];
		var bpMin = project['bpMin'];
		var massMax = project['massMax'];
		var massMin = project['massMin'];
		var ec = project['ec'];
		this.ui = [
			Line.create({
				cells: [
					Cell.create({component: Label, v: 'property'}), 
					Cell.create({component: Label, v: 'value'})
				]
			}),
			Line.create({
				cells: [
					Cell.create({component: Label, v: 'label'}),
					Cell.create({component: Label, v: label})
				]
			}),
			Line.create({
				cells: [
					Cell.create({component: Label, v: 'bpMax'}),
					Cell.create({component: Label, v: bpMax})
				]

			}),
			Line.create({
				cells: [
					Cell.create({component: Label, v: 'bpMin'}),
					Cell.create({component: Label, v: bpMin})
				]

			}),
			Line.create({
				cells: [
					Cell.create({component: Label, v: 'massMax'}),
					Cell.create({component: Label, v: massMax})
				]

			}),
			Line.create({
				cells: [
					Cell.create({component: Label, v: 'massMin'}),
					Cell.create({component: Label, v: massMin})
				]
			}),
			Line.create({
				cells: [
					Cell.create({component: Label, v: 'ec'}),
					Cell.create({component: Label, v: ec})
				]
			}),
			Line.create({
				cells: [
					Cell.create({component: Label, v: 'sorp'}),
					Cell.create({
						component: Input,
						param: {
							onChange: function(v){
								this.v = v;
							}, 
							onBlur: function(){
								Property.signal_sorp_blur.dispatch();
							},
			        		value: sorp,
						}, 
						v: sorp
					})
				]
			})
        ];*/
	}
}

Property.signal_sorp_change = new Signal();
Property.signal_sorp_blur = new Signal();

module.exports = Property;