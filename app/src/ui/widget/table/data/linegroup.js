import Util from 'Util';


//multiple lines. eg: project property, project engine...
class LineGroup {
    static create(param){
        var lineGroup = new LineGroup();
        lineGroup.init(param);
        return lineGroup;
    }

	init(param){
		this.id = param.id || Util.generateUUID();
		this.lines = param.lines;
	}
}
module.exports = LineGroup;