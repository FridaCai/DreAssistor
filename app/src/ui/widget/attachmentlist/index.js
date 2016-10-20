import Util from 'Util';
import Attachment from '../../page_task/data/attachment.js';
import "./style.less";
import Request from 'Request';

var AttachmentList = React.createClass({
	getInitialState: function(){
		return {
		  attachments: this.props.attachments,
		}
	},
	getValue: function(){
		return this.state.attachments;
	},
	onAddClk: function(){
		this.refs.fileElem.click();
	},
	fileElemChange: function(e){
	    e.preventDefault();
	    
	    var files = e.target.files;
	    const maxFileSize = 2000000; //2m

	    var formData = new FormData();

	    for(var i=0; i<files.length; i++){
	      var file = files[i];
	      if(file.size < maxFileSize){
	      	formData.append('uploads[]', file, file.name);	
	      }else{
	      	console.log('file is too large');
	      }
    	}





    	var url = Request.getBackendAPI('uploadfile');
	    $.ajax({
	      url: url,
	      type: 'POST',
	      data: formData,
	      processData: false,
	      contentType: false,
	      success: function(data){
	          console.log('upload successful!\n' + data);
	      },
	      xhr: function() {
	        // create an XMLHttpRequest
	        var xhr = new XMLHttpRequest();

	        // listen to the 'progress' event
	        xhr.upload.addEventListener('progress', function(evt) {

	          if (evt.lengthComputable) {
	            // calculate the percentage of upload completed
	            var percentComplete = evt.loaded / evt.total;
	            percentComplete = parseInt(percentComplete * 100);

	            // update the Bootstrap progress bar with the new percentage
	            //$('.progress-bar').text(percentComplete + '%');
	            //$('.progress-bar').width(percentComplete + '%');
	            console.log(percentComplete)

	            // once the upload reaches 100%, set the progress bar text to done
	            //if (percentComplete === 100) {
	              //$('.progress-bar').html('Done');
	            //}

	          }

	        }, false);

	        return xhr;
	      }
	    });
















	      /*var attachment = Attachment.create({
	        id: Util.generateUUID(),
	        label: label,
	        url: url,
	      })
	      this.state.attachments.add(attachment);*/

	    /*if(this.props.onAdd){
			this.props.onAdd.call(this.props.scope, this.state.attachments);
		}
	    this.forceUpdate();*/
	},

	onDelete: function(id){
	    this.state.attachments.deleteById(id);
	    this.forceUpdate();

	    if(this.props.onDelete){
	      this.props.onDelete.call(this.props.scope, this.state.attachments);
	    }
	},
	onDownload: function(){

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
	                    var {id, url, label} = attachment;

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
						        	<a href="#" className="btn btn-primary" role="button" onClick={this.onDelete.bind(this, id)}>删除</a> 
						        	<a href="#" className="btn btn-default" role="button" onClick={this.onDownload.bind(this, attachment)}>下载</a>
					        	</h5>
						      </div>
						    </div>
						  </div>
	                    )
                  	}).bind(this))
				  }


		          <form className='upload'>
		            <input name='uploadfile' type="file" ref="fileElem" multiple accept="*/*" onChange={this.fileElemChange}/>
		          </form>
		        </div>
			</div>
			
		)
	}
})
module.exports = AttachmentList;