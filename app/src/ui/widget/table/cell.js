import Signal from 'Signal';
import RadioGroup from 'RadioGroup';
import {ExpandCell} from 'Table';
import {ExpandContainer} from 'Table';
import Input from 'Input';
import Label from 'Label';


var CellDOM = React.createClass({
  	getInitialState(){
  		cell: this.props.cell,
  		widthStyle: this.props.widthPercentage,
  	}

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
	    	cell: cell,
	    });

      return (
          <td key={cell.id} style={widthStyle}>{el}</td>
      );
    }
})

//CellDOM.signal_expand_toggle = new Signal();

module.exports = CellDOM
