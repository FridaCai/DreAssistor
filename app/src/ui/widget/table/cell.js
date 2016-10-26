var CellDOM = React.createClass({
  	getInitialState(){
      return {
        cell: this.props.cell,
        widthStyle: this.props.widthStyle,  
      }
  	},

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
	    	cell: cell,
        v: cell.v, //for data model.
        param: $.extend({
          isReadOnly: this.props.isReadOnly
        }, cell.param), //for component like radio button.

	    });

      return (
          <td key={cell.id} 
            className={dom.displayName} 
            style={widthStyle}>
            {el}
          </td>
      );
    }
})

module.exports = CellDOM
