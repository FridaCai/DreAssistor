import Normal from '../data/template/normal.js';
var NormalTemplate = React.createClass({
	getValue(){
        var normal = new Normal();
        normal.init();
        return normal;
	},
	render(){
		return null;
	}
});
module.exports = NormalTemplate;