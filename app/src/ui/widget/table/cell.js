var CellDOM = React.createClass({
  	getInitialState(){
      return {
        cell: this.props.cell,
        widthStyle: this.props.widthStyle,  
      }
  	},

   	/*getValue(){
   		if(this.refs.component && this.refs.component.getValue)
   			return this.refs.component.getValue();
   		return '';
    }*/

    render(){
    	var {cell, widthStyle} = this.state;
    	var ref= 'component';

    	if(cell.isHide || !cell.component){
            return null;
      }

		  var dom = cell.component;
	    var el = React.createElement(dom, {
	    	ref: ref,
	    	key: cell.id,
	    	param: cell.param,
        v: cell.v,
	    });

      return (
          <td key={cell.id} style={widthStyle}>{el}</td>
      );
    }
})

//CellDOM.signal_expand_toggle = new Signal();

module.exports = CellDOM
