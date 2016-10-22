import Util from 'Util';
import Attachment from '../../page_task/data/attachment.js';
import "./style.less";
import Request from 'Request';
import Thumbnail from './thumbnail.js';

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
		const maxFileSize = 10 * 1000000; //10m

		e.preventDefault();
		var files = e.target.files;
		var file = files[0];


		if(file.size > maxFileSize){
			//todo: show popup. do nothing.
			//return;
		}

		

	    
		var label = file.name; 
		var id = Util.generateUUID();
		//add new thumbnail
		var attachment = Attachment.create({
			id: id,
			label: label,
			status: 0,
			progress: 0,
		})
		this.state.attachments.add(attachment);

	    if(this.props.onAdd){
			this.props.onAdd.call(this.props.scope, this.state.attachments);
		}
	    this.forceUpdate();



	    //todo: save to db when click save button;
		



		//upload to file system and return guid.
		var me = this;
		var formData = new FormData();
        formData.append('file', file, label);
        formData.append('id', id);
        var options = {
            'contentType': false,
            'processData': false,
            'uploadProgress': function() {
		        var xhr = new XMLHttpRequest();
		        xhr.upload.addEventListener('progress', function(evt) {
		          if (evt.lengthComputable) {
		            attachment.update({
		            	progress: parseInt(evt.loaded / evt.total * 100)
		            });

		            me.forceUpdate();
		          }
		        }, false);
		        return xhr;
	        }
        };
        var url = Request.getBackendAPI('uploadfile');

        Request.postData(url, formData, options).then(function(result){
        	attachment.update({
        		status: 1, 
        		guid: result.guid
        	})

        	me.forceUpdate();
        }, function(result){
        	attachment.update({
				status: 2        		
        	})
        	me.forceUpdate();
        }).catch((error) => {
        	console.log(error);
        });




		//need to save guid, src filename, src file ext, to client dm
	},


	onDelete: function(attachment){
	    this.state.attachments.deleteById(attachment.id);
	    this.forceUpdate();

	    if(this.props.onDelete){
	      this.props.onDelete.call(this.props.scope, this.state.attachments);
	    }
	},
  
    onFileInputClk: function(){
        this.refs.fileElem.value = null;  
    },
   
	render(){
		var attachments = this.state.attachments;

		return (
			<div className='attachmentList'>
				<div className='addBtn'>
					<a href="#" className="btn btn-primary" role="button" onClick={this.onAddClk}>添加</a> 
				</div>
				<div className="row">
				  {
				  	 attachments.map((function(attachment){
	                    return (
	                      <div className="col-sm-2" key={attachment.id}>
						    <Thumbnail param={attachment} 
						    	onDelete={this.onDelete.bind(this, attachment)}/>
						  </div>
	                    )
                  	}).bind(this))
				  }
		          <form className='upload'>
		            <input name='uploadfile' type="file" ref="fileElem" accept="*/*" 
		            	onChange={this.fileElemChange}
		            	onClick={this.onFileInputClk}/>
		          </form>
		        </div>
			</div>
			
		)
	}
})
module.exports = AttachmentList;