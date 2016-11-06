import './style.less';
import './uidata.js';

var SearchResultPanel = React.createClass({
	getInitialState: function() {
        return {
        	dm: this.props.dm
        };
    },
    
	render(){
	   return null;
        /*return ( 
        	<TableDOM uidata={uidata} ref='table' onDrop={this.onDragTreeDataInTable}/>
    	)*/
	}
})

module.exports = SearchResultPanel;