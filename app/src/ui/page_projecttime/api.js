import Util from '../../util.js';
import Signal from '../../signal.js';

var API = {
	signal_appProjectPopup_show: new Signal(),
	signal_projects_add: new Signal(),
	
	
	getData: function() {
		return Util.getData('res/mockupapi/getdata.json');
	},

	getFilteredProjectList: function(projectList, templateList){
        //process templates for project creation purpose.
        //remove already added project.

        //step1: go though all mobile year in template, 
        //if(projectId, mobileYearId) exists in projectList
        //marked as deprecated.

        var existInProjectList = function(projectId, mobileYearId) {
            var found = projectList.find(function(project){
                return (project.projectId === projectId && project.mobileYearId === mobileYearId);
            })

            if(found)
                return true;
            return false;
        }

        var templates = [].concat(templateList);
        templates.map(function(template) {
            template.mobileYears.map(function(mobileYear){
                if (existInProjectList(template.projectId, mobileYear.id)) {
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