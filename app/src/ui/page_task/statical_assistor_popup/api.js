import Projects from '../data/projects';
import Signal from 'Signal';
import GloabalAPI from '../api.js';

import TCDM from './data/table';
import TableUIData from './uidata/table';

var API = {
	signal_treeNode_click: new Signal(),
	signal_table_refresh: new Signal(),

	_projects: undefined,

	setProjects: function(obj){
		this._projects = Projects.create(obj);
	},

	getProjects: function(){
		return this._projects;
	},

	/*
		dm for table curve.
	*/

	_tcDM: TCDM.create(),
	getTCDM: function(){
		return this._tcDM;
	},


	/*
		uidata for table
	*/
	_tabelUIData: new TableUIData(),
	getTabelUIData: function(){
		return this._tabelUIData;
	},

	dm2ui: function(){
		this._tabelUIData.dm2ui(this._tcDM);
	},
	ui2dm: function(){
		this._tabelUIData.ui2dm(this._tcDM);	
	},
	appendNewTableLine: function(){
		this._tcDM.sheets[0].appendLine();


		
	},
	clearTable: function(){
		this._tcDM.reset();	
	},
/* need???
	_treeEntity: undefined,
	setSelectedTreeEntity: function(entity){
		this._treeEntity = entity;
	},
	getSelectedTreeEntity: function(){
		return this._treeEntity;
	}
*/
	
}

window.statical={
	tcdm: API._tcDM,
	treedm: API.getProjects(),
	tableui: API._tabelUIData,
}
module.exports = API;
