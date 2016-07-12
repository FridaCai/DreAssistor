import './index.less';

var UploadFileComponent = React.createClass({
	onDrop: function(e){
	  	e.stopPropagation();
	  	e.preventDefault();
	  	var files = e.dataTransfer.files;
		var reader = new FileReader();

		var file = files[0];
	  	var fileName = file.name;
	  	reader.onload = (function(e){
	  		var data = e.target.result;
	  		this.props.onDrop(fileName, data);
	  	}).bind(this);
		reader.readAsBinaryString(file);
	},

	onDragOver(e){
		e.preventDefault();
	},

	render(){
		return(
          <div  className='fileArea' onDragOver={this.onDragOver} onDrop={this.onDrop}>
            请将文件拖至此处上传
          </div>
         )
	}
})
module.exports = UploadFileComponent;
