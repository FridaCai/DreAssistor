import Util from 'Util';
import Images from '../../page_task/data/images.js';


var ImageList = React.createClass({
	getInitialState: function(){
		return {
		  images: this.props.images || new Images(),
		}
	},
	getValue: function(){
		return this.state.images;
	},
	onAddClk: function(){
		this.refs.fileElem.click();

		if(this.props.onAttachmentAdd){
			this.props.onAttachmentAdd.call(this.props.scope, this.state.images);
		}
	},
	fileElemChange: function(e){
	    e.preventDefault();
	    //call service to upload file.
	    var files = e.target.files;

	    for(var i=0; i<files.length; i++){
	      var file = files[i];
	      var label = file.name;
	      
	      var image = {
	        id: Util.generateUUID(),
	        label: label,
	        detail: '',
	        url: '',
	      }
	      this.state.images.add(images);
	    }
	    this.forceUpdate();
	},

	onDelete: function(id){
	    this.state.images.deleteById(id);
	    this.forceUpdate();

	    if(this.props.onImageDelete){
	      this.props.onImageDelete.call(this.props.scope, this.state.images);
	    }
	},
	render(){
		var {id, url, label, detail} = this.state.param;
		//<span class="glyphicon glyphicon-paperclip" aria-hidden="true"></span>

		return (
			<div className='imageList'>
				<div class="row">
				  <div class="col-sm-6 col-md-4" key={id}>
				    <div class="thumbnail" onClick={this.onAddClk}>
				      +
				    </div>
				  </div>

				  <div class="col-sm-6 col-md-4" key={id}>
				    <div class="thumbnail">
				      <img src={url} alt={detail}/>
				      <div class="caption">
				        <h3>{label}</h3>
				        <p>{detail}</p>
				        <p>
				        	<a href="#" class="btn btn-primary" role="button">删除</a> 
				        	<a href="#" class="btn btn-default" role="button">下载</a>
			        	</p>
				      </div>
				    </div>
				  </div>

				  <div class="col-sm-6 col-md-4" key={id}>
				    <div class="thumbnail">
				      <img src={url} alt={detail}/>
				      <div class="caption">
				        <h3>{label}</h3>
				        <p>{detail}</p>
				        <p>
				        	<a href="#" class="btn btn-primary" role="button">删除</a> 
				        	<a href="#" class="btn btn-default" role="button">下载</a>
			        	</p>
				      </div>
				    </div>
				  </div>
				</div>

	            <form className='upload'>
	              <input type="file" ref="fileElem" multiple accept="*/*" onChange={this.fileElemChange}/>
	            </form>
			</div>
			
		)
	}
})
module.exports = ImageList;