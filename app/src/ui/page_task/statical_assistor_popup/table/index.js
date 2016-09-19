
var Table = React.createClass({
	getInitialState: function() {
        return {
            title: this.props.title,
        };
    },

	getContent: function() {
	    return (
	    	<div className='staticalassistorpopup'>
				<DataTree />		    		
				<div className='tableChart'>
					<Table/>
				</div>				
	    	</div>
	    );   
    },


	render() {
        
        return (<div className='table'>

    	</div>);
    },
})

module.exports = Table;