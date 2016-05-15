import Util from '../../util.js';
import Signal from '../../signal.js';
import Projects from './data/projects.js';
import People from './data/people.js';
import AppAPI from '../../api.js';

//import AppApi from 

var API = {
	signal_appProjectPopup_show: new Signal(),
    signal_addSubProjectPopup_show: new Signal(),
	signal_projects_add: new Signal(),
    signal_msgbox_show: new Signal(),
    signal_page_refresh: new Signal(),
    signal_project_selectchange: new Signal(),
    signal_editSubProjectPopup_show: new Signal(),


    getLoginUser: function() {
        return AppAPI.getLoginUser();
    },






    _selectedProject: undefined,
    getSelectedProject: function() {
        return this._selectedProject;
    },
    setSelectedProject: function(value) {
        this._selectedProject = value;
    },
    initSelectedProject: function() {
        var projects = this.getProjects();
        this._selectedProject = projects.length ? projects[0] : undefined;

        this.initSelectedSubproject();
        this.initSelectedTask();
    },






    _selectedSubProject: undefined,
    getSelectedSubProject: function() {
        return this._selectedSubProject;
    },
    setSelectedSubProject: function(value) {
        this._selectedSubProject = value;
    },
    initSelectedSubproject: function() {
        var project = this.getSelectedProject();
        if(!project){
            this._selectedSubProject = undefined;
            return;
        }

        var subprojects = project.children;
        this._selectedSubProject = subprojects.length ? subprojects[0] : undefined;
    },





    _selectedTask: undefined,
    getSelectedTask: function() {
        return this._selectedTask;
    },
    setSelectedTask: function(value) {
        this._selectedTask = value;
    },
    initSelectedTask: function() {
        var subproject = this.getSelectedSubProject();
        if(!subproject){
            this._selectedTask = undefined;
            return;
        } 

        var tasks = subproject.tasks;
        this._selectedTask = tasks.length ? tasks[0] : undefined;
    },


	







    _people: new People(),
    getPeople: function() {
        return this._people.arr;
    },
    setPeople: function(value) {
        this._people.init(value);
    },
    findPersonById: function(id) {
        return this.getPeople().find(function(person){
            return (person.id === id);
        });
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





    deleteSubProject: function(subproject) {
        subproject.getParent().deleteChild(subproject);
    },
    addSubproject: function(project, subproject){
        project.addChild(subproject);
    },
    editSubproject: function(subproject, oldProject, newProject) {
        oldProject.deleteChild(subproject);
        newProject.addChild(subproject);
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