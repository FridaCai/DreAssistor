import Signal from '../../../signal.js';

var API = {
	signal_popup_show: new Signal(),

	data: {
		property: undefined,
		tags: [],
		tasks: [],
	},

	getSheetName: function(name){
        if(!name)
            return undefined;

        var reg = /\$\{(.*)\}/;
        var match = name.match(reg);
        if(match.length != 2)
            return undefined;

        return match[1];
    },	
    getTimeBySorpWeek: function(sorp, week){
        var substract = moment(sorp, 'x').subtract(week, 'weeks');
        var ux = substract.valueOf();
        return ux;
    },
}

module.exports = API;

