import Util from 'Util';
import {Images} from '../../page_task/data/images.js';
import "./style.less";

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
		//var images = this.state.images;
		var images = [{
			id: 0, 
			url: '/app/res/patac.jpeg',
			label: 'thumbnail',
			detail: 'detaildetaildetaildetaildetaildetaildetaildetaildetaildetaildetail'
		},{
			id: 1, 
			url: '/app/res/patac2.png',
			label: 'thumbnail',
			detail: 'detaildetaildetaildetaildetaildetaildetaildetaildetaildetaildetail'
		},{
			id: 2, 
			url: '/app/res/patac3.gif',
			label: 'thumbnail',
			detail: 'detaildetaildetaildetaildetaildetaildetaildetaildetaildetaildetail'
		},{
			id: 3, 
			url: '/app/res/patac4.png',
			label: 'thumbnail',
			detail: 'detaildetaildetaildetaildetaildetaildetaildetaildetaildetaildetail'
		},{
			id: 4, 
			url: '/app/res/patac5.png',
			label: 'thumbnail',
			detail: 'detaildetaildetaildetaildetaildetaildetaildetaildetaildetaildetail'
		},{
			id: 5, 
			url: '/app/res/patac6.png',
			label: 'thumbnail',
			detail: 'detaildetaildetaildetaildetaildetaildetaildetaildetaildetaildetail'
		},{
			id: 6, 
			url: '/app/res/patac7.png',
			label: 'thumbnail',
			detail: 'detaildetaildetaildetaildetaildetaildetaildetaildetaildetaildetail'
		},{
			id: 7, 
			url: '/app/res/patac.jpeg',
			label: 'thumbnail',
			detail: 'detaildetaildetaildetaildetaildetaildetaildetaildetaildetaildetail'
		},{
			id: 8, 
			url: '/app/res/patac.jpeg',
			label: 'thumbnail',
			detail: 'detaildetaildetaildetaildetaildetaildetaildetaildetaildetaildetail'
		},{
			id: 9, 
			url: '/app/res/patac.jpeg',
			label: 'thumbnail',
			detail: 'detaildetaildetaildetaildetaildetaildetaildetaildetaildetaildetail'
		}]
		
		//<span class="glyphicon glyphicon-paperclip" aria-hidden="true"></span>
		/*
			<div className="col-sm-6 col-md-4" >
				    <div className="thumbnail" onClick={this.onAddClk}>
				      +
				    </div>
				  </div>
		*/
		return (
			<div className='imageList'>
				<div className='addBtn'>
					<a href="#" className="btn btn-primary" role="button" onClick={this.onAddClk}>添加</a> 
				</div>
				<div className="row">

				  {
				  	 images.map((function(image){
	                    var {id, url, label, detail} = image;

	                    return (
	                      <div className="col-sm-2" key={id}>
						    <div className="thumbnail">
						      <img src={url} alt={detail}/>
						      <div className="caption">
						        <h3>{label}</h3>
						        <h4>{detail}</h4>
						        <h5>
						        	<a href="#" className="btn btn-primary" role="button">删除</a> 
						        	<a href="#" className="btn btn-default" role="button">下载</a>
					        	</h5>
						      </div>
						    </div>
						  </div>
	                    )
                  	}).bind(this))
				  }

]

		          <form className='upload'>
		            <input type="file" ref="fileElem" multiple accept="*/*" onChange={this.fileElemChange}/>
		          </form>
		        </div>
			</div>
			
		)
	}
})
module.exports = ImageList;