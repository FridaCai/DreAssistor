import Util from 'Util';
import Attachments from 'data/attachments.js';
import Attachment from 'data/attachment.js';
import "./style.less";
import Request from 'Request';
import Thumbnail from './thumbnail.js';
import MessageBox from 'MessageBox';

var AttachmentList = React.createClass({
	getInitialState: function(){
		return {
		  attachment: this.props.attachment,
		  taskId: this.props.taskId,
		  propertyId: this.props.propertyId
		}
	},
	componentDidMount: function(){
		var {taskId, propertyId} = this.state;

		var needQuery = function(id){
			if(id === undefined){
				return false;
			}
			if(Util.isUUID(id)){
				return false;
			}
			return true;
		}

		if(!needQuery(taskId) && !needQuery(propertyId)){
			return;
		}
		if(taskId == undefined && propertyId== undefined){
			console.error('wrong');
			return;
		}

		var url = Request.getBackendAPI('attachment');
		if(taskId != undefined){
			url = `${url}/taskId/${taskId}`;
		}else if(propertyId!=undefined){
			url = `${url}/propertyId/${propertyId}`;
		}

		Request.getData(url).then((function(result){
			if(result.errCode != -1){
				return;
			}

			var attachment = Attachments.create(result.attachment);
			attachment.sort(function(a1, a2){
				return a1.id < a2.id
			})
			this.setState({
				attachment: attachment
			})
		}).bind(this));
	},
	getValue: function(){
		return this.state.attachment;
	},
	onAddClk: function(){
		this.refs.fileElem.click();
	},

	fileElemChange: function(e){
		const maxFileSize = 50 * 1000000; //10m

		e.preventDefault();
		var files = e.target.files;
		var file = files[0];


		if(file.size > maxFileSize){
			var msg = `请上传小于50m的文件`;
	        ReactDOM.unmountComponentAtNode(this.refs.popup);    
	        ReactDOM.render(<MessageBox msg={msg} cName={'msg_4_2'} isShow={true}/>, this.refs.popup);
			return;
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
		this.state.attachment.add(attachment);


	    this.forceUpdate();



	    //todo: save to db when click save button;
		



		//upload to file system and return guid.
		var me = this;
		var formData = new FormData();
        formData.append('file', file, label);
        formData.append('id', id);
        var options = {
            contentType: false,
            processData: false,
         	xhr: function() {
                var xhr = new XMLHttpRequest();
		        xhr.upload.addEventListener('progress', function(evt) {
		          if (evt.lengthComputable) {
		            attachment.update({
		            	progress: parseInt(evt.loaded / evt.total * 100)
		            });
		            console.log('frida test');
		          	console.log(attachment.progress);
		            try{
						me.forceUpdate();
		            }catch(err){
		            	//do nothing. for the case that panel already closed;
		            }
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
		    if(me.props.onAdd){
				me.props.onAdd.call(me.props.scope, me.state.attachment);
			}
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
	    this.state.attachment.deleteById(attachment.id);
	    this.forceUpdate();

	    if(this.props.onDelete){
	      this.props.onDelete.call(this.props.scope, this.state.attachment);
	    }
	},
  
    onFileInputClk: function(){
        this.refs.fileElem.value = null;  
    },
   
	render(){

		var attachments = this.state.attachment;

		return (
			<div className='attachmentList'>
				<div className='addBtn'>
					<button disabled={this.props.isReadOnly} className="btn btn-primary" onClick={this.onAddClk}>添加</button> 
				</div>
				<div className="row">
				  {
				  	 attachments.map((function(attachment){
	                    return (
	                      <div className="col-sm-3" key={attachment.id}>
						    <Thumbnail param={attachment} 
						    	onDelete={this.onDelete.bind(this, attachment)} isReadOnly={this.props.isReadOnly}/>
						  </div>
	                    )
                  	}).bind(this))
				  }
		          <form className='upload'>
		            <input name='uploadfile' type="file" ref="fileElem" accept="*/*" 
		            	onChange={this.fileElemChange}
		            	onClick={this.onFileInputClk}/>
		          </form>
		          <div ref='popup'></div>
		        </div>
			</div>
			
		)
	}
})
module.exports = AttachmentList;