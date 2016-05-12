import Util from '../../util.js';
import Signal from '../../signal.js';
import Projects from './data/projects.js';
import People from './data/people.js';

//import AppApi from 

var API = {
	signal_appProjectPopup_show: new Signal(),
    signal_addSubProjectPopup_show: new Signal(),
	signal_projects_add: new Signal(),
    signal_msgbox_show: new Signal(),
    signal_page_refresh: new Signal(),
    signal_project_selectchange: new Signal(),


    getCreator: function(){
        //return AppApi.getCreator();
        return 'pai';
    },










    _selectedProject: undefined,
    getSelectedProject: function() {
        return this._selectedProject;
    },
    setSelectedProject: function(value) {
        this._selectedProject = value;
    },
    initSelectedProject: function() {
        this._selectedProject = this.getProjects().length ? this.getProjects()[0] : undefined;
    },






    _selectedSubProject: undefined,
    getSelectedSubProject: function() {
        return this._selectedSubProject;
    },
    setSelectedSubProject: function(value) {
        this._selectedSubProject = value;
    },





    _selectedTask: undefined,
    getSelectedTask: function() {
        return this._selectedTask;
    },
    setSelectedTask: function(value) {
        this._selectedTask = value;
    },


	







    _people: new People(),
    getPeople: function() {
        return this._people.arr;
    },
    setPeople: function(value) {
        this._people.init(value);
    },









    _projects: new Projects(),
    
    setProjects: function(value) {
        this._projects.init(value);
    },

    getProjects: function() {
        return this._projects.arr;
    },

    addProjects: function(newProjects) {
        this._projects.batchAdd(newProjects);
    },
    deleteProject: function(projectId, mobileYearId) {
        this._projects.delete(projectId, mobileYearId);

        this.initSelectedProject();
    },
    findProject: function(projectId, mobileYearId) {
        return this._projects.find(projectId, mobileYearId);
    },







    toggleSubprojectVisbility: function(subproject) {
        subproject.toggleVisibility();
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