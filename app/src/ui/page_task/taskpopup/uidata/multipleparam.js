import {Base} from 'Table'; 
import {Cell} from 'Table';
import {ExpandLine} from 'Table';
import {Line} from 'Table';
import {ExpandContainerDOM} from 'Table';
import {ExpandCellDOM} from 'Table';
import Label from 'Label';

import {COMPONENT_ENUM} from '../../data/template/mix.js';
import {COMPONENT_LABEL_ENUM} from '../../data/template/mix.js';

import {SingleParam} from '../../data/template/mix.js';

import Util from 'Util';
import TmpUtil from 'TmpUtil';

import Signal from 'Signal';

class MultipleParamUIData extends Base{
	constructor(){
		super();
		this.header = null;
		this.sheetName = '';
		this.components = [];

		this.signal_expand_toggle = new Signal();
		this.signal_data_change = new Signal();
	}

	setHeader(){
		this.header = TmpUtil.getHeader(this.components);
	}
	ui2dm(dm){
		for(var i=0; i<this.ui.length; i++){
			var line = this.ui[i];
			var id = line.id;
			if(line instanceof ExpandLine)
				continue;

			this.components.map(function(component, index){
				if(dm[id] instanceof SingleParam){
					dm[id][component] = line.getCellAt(index).getValue();	
				}
			})
		}
	}
	

	dm2ui(project, dm){
		var needExpandLine = (function(components){
			if(components.indexOf(COMPONENT_ENUM.CURVE)!=-1 
				|| components.indexOf(COMPONENT_ENUM.ATTACHMENT)!=-1 
				|| components.indexOf(COMPONENT_ENUM.IMAGES)!=-1){
				return true;
			}
			return false;
		})(this.components)

		Object.keys(dm).map((function(key){
			var property = dm[key]; //todo: correct? maybe an array.
			if(property instanceof SingleParam){
				var cells = this.components.map((function(component){
					if(component === COMPONENT_ENUM.REFKEY){
						var refKeyTmpDM = {
							value: Util.getValueByProjectRefKey(property.refKey, project),
							v: property.refKey
						};
						return TmpUtil.getCellByComponent(component, refKeyTmpDM, this);
					}

					return TmpUtil.getCellByComponent(component, property, this);
				}).bind(this));

				var expandLine = needExpandLine ? ExpandLine.create({
					cells: [Cell.create({component: ExpandContainerDOM, param: {}})],
					parent: this
				}): null;

				this.ui.push(Line.create({
					cells: cells,
					parent: this,
					id: key
				}))

				if(needExpandLine){
					this.ui.push(expandLine);
				}
			}
		}).bind(this));
	}
}

module.exports = MultipleParamUIData;





