import EWO from '../data/template/ewo.js';

var EWOTemplate = React.createClass({
  	getValue(){
        var ewo = new EWO();
        ewo.init();
        return ewo;
    },

	render(){
       return null;
	}
});
module.exports = EWOTemplate;