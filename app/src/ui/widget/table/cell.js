var CellDOM = React.createClass({
  	getInitialState(){
      return {
        cell: this.props.cell,
        widthStyle: this.props.widthStyle,  
      }
  	},
    onDragOver(e){
      e.preventDefault();
    },
    onDrop(){

      /*
      const [row, time] = this.rowAndTimeFromEvent(e)
      if (row >= 0 && row < this.props.groups.length) {
        var templateType = e.dataTransfer.getData('text');
        e.dataTransfer.clearData();

        if(!templateType)
          return;

        this.onAppendTask(parseInt(templateType), row, time);
      */
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
        param: cell.param, //for component like radio button.
	    });

      return (
          <td key={cell.id} 
            className={dom.displayName} 
            style={widthStyle} 
             onDragOver={this.onDragOver}
             onDrop={this.onDrop}
               >
            {el}
          </td>
      );
    }
})

module.exports = CellDOM
