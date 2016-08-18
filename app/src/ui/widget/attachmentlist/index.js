import Util from 'Util';
import {Attachments} from '../../page_task/data/attachments.js';
import {Attachment} from '../../page_task/data/attachments.js';
import "./style.less";

var AttachmentList = React.createClass({
	getInitialState: function(){
		return {
		  attachments: this.props.attachments || new Attachments(),
		}
	},
	getValue: function(){
		return this.state.attachments;
	},
	onAddClk: function(){
		this.refs.fileElem.click();

		if(this.props.onAttachmentAdd){
			this.props.onAttachmentAdd.call(this.props.scope, this.state.attachments);
		}
	},
	fileElemChange: function(e){
	    e.preventDefault();
	    //call service to upload file.
	    var files = e.target.files;

	    for(var i=0; i<files.length; i++){
	      var file = files[i];
	      var label = file.name;
	      var url = '/app/res/' + label;
	      var attachment = Attachment.create({
	        id: Util.generateUUID(),
	        label: label,
	        detail: '',
	        url: url,
	      })
	      this.state.attachments.add(attachment);
	    }
	    this.forceUpdate();
	},

	onDelete: function(id){
	    this.state.attachments.deleteById(id);
	    this.forceUpdate();

	    if(this.props.onAttachmentDelete){
	      this.props.onAttachmentDelete.call(this.props.scope, this.state.attachments);
	    }
	},
	render(){
		var attachments = this.state.attachments;

		var allowPreview = function(url){
			var suffixes = ['jpg', 'jpeg', 'gif', 'tif', 'tiff', 'png'];
			for(var i=0; i<suffixes.length; i++){
				var suffix = suffixes[i];
				if(url.endsWith(`.${suffix}`)){
					return true;
				}
			}	
			return false;
		};

		return (
			<div className='attachmentList'>
				<div className='addBtn'>
					<a href="#" className="btn btn-primary" role="button" onClick={this.onAddClk}>添加</a> 
				</div>
				<div className="row">

				  {
				  	 attachments.map((function(attachment){
	                    var {id, url, label, detail} = attachment;

	                    var attachmentDom = allowPreview(url) 
	                    	? (<img alt={label} src={url}/>)
	                    	: (<span className="glyphicon glyphicon-paperclip" aria-hidden="true" style={{fontSize: '20px'}}></span>)

	                    return (
	                      <div className="col-sm-2" key={id}>
						    <div className="thumbnail">
						      {attachmentDom}
						      <div className="caption">
						        <h4>{label}</h4>
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


		          <form className='upload'>
		            <input type="file" ref="fileElem" multiple accept="*/*" onChange={this.fileElemChange}/>
		          </form>
		        </div>
			</div>
			
		)
	}
})
module.exports = AttachmentList;