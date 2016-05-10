import Util from '../../util.js';
import Signal from '../../signal.js';

var API = {
	signal_appProjectPopup_show: new Signal(),
	signal_projects_add: new Signal(),
    
    signal_msgbox_show: new Signal(),
    signal_page_refresh: new Signal(),


    signal_project_selectchange: new Signal(),

	



    _projects: undefined,
    setProjects: function(value) {
        this._projects = value;
    },
    getProjects: function() {
        return this._projects;
    },

    addProjects: function(newProjects) {
        this._projects = newProjects.concat(this._projects);
    },
    deleteProjects: function(projectId, mobileYearId) {
        this._projects = this._projects.filter((project) => {
            return !(project.projectId === projectId && project.mobileYearId === mobileYearId);
        });
    },
    refreshPage: function(param) {
        this.signal_page_refresh.dispatch(param);
    },






    _projectTemplates: undefined,
    setProjectTemplates: function(value){
        this._projectTemplates = value;
    },
    getProjectTemplates: function(){
        return this._projectTemplates;
    },








	getData: function() {
		return Util.getData('res/mockupapi/getdata.json');
	},

	getFilteredProjects: function(projects, templateList){
        //process templates for project creation purpose.
        //remove already added project.

        //step1: go though all mobile year in template, 
        //if(projectId, mobileYearId) exists in projectList
        //marked as deprecated.

        var existInProjects = function(projectId, mobileYearId) {
            var found = projects.find(function(project){
                return (project.projectId === projectId && project.mobileYearId === mobileYearId);
            })

            if(found)
                return true;
            return false;
        }

        var templates = $.extend(true, [], templateList);
        templates.map(function(template) {
            template.mobileYears.map(function(mobileYear){
                if (existInProjects(template.projectId, mobileYear.id)) {
                    mobileYear.isdeprecated = true;
                }
            })
        })

        //step2: go though template tree, pick tree node which has no-deprecated mobile year.
        var results = [];
        templates.map(function(template) {
            var mobileYears = template.mobileYears.filter(function(mobileYear){
                if(mobileYear.isdeprecated)
                    return false;
                return true;
            })

            if(!mobileYears.length)
                return false; 

            var node = {
                projectId: template.projectId,
                label: template.label,
                mobileYears: mobileYears,
            }
            results.push(node);
        });
        return results;
    },

}

module.exports = API;