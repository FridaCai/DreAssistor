import Util from 'Util';
import "./style.less";
import Request from 'Request';

var Thumbnail = React.createClass({
	getInitialState: function(){
		return {
		 	param: this.props.param
		}
	},
	
	onDelete: function(){
		var attachment = this.state.param;
		this.props.onDelete && this.props.onDelete(attachment);
	},
	_getURL: function(attachment){
		var {guid, label} = attachment;
		var url = Request.getBackendAPI(`downloadfile?guid=${guid}&label=${label}`);
		return url;
	},
	onDownload: function(){
		var attachment = this.state.param;
		var url = this._getURL(attachment);
		Request.getData(url, {});
	},
	render(){
        var getDom = (function(param){
        	var {guid, label} = param;

        	var allowPreview = function(label){
				var suffixes = ['jpg', 'jpeg', 'gif', 'tif', 'tiff', 'png'];
				for(var i=0; i<suffixes.length; i++){
					var suffix = suffixes[i];
					if(label.endsWith(`.${suffix}`)){
						return true;
					}
				}	
				return false;
			};
			var attachment = this.state.param;
			var url = this._getURL(attachment);

			var attachmentDom;
			if(allowPreview(label)){
				attachmentDom = (<img alt={label} src={url}/>);
			}else{
				attachmentDom = (<span className="glyphicon glyphicon-paperclip" aria-hidden="true" style={{fontSize: '20px'}}></span>);
			}

        	return (
			    <div className="thumbnail">
			      {attachmentDom}
			      <div className="caption">
			        <h4>{label}</h4>
			        <h5>
			        	<a href="#" className="btn btn-primary" role="button" onClick={this.onDelete}>删除</a> 
			        	<a href={url} className="btn btn-default" role="button" >下载</a>
		        	</h5>
			      </div>
			    </div>
	        )
        }).bind(this);

        var getLoadingDom = (function(progress){
        	var label = `Loading... ${progress}`;

        	return (<div className="thumbnail">
				{label}
		    </div>)
        }).bind(this);


        var getFailDom = (function(progress){
        	var label = `Fail!`;

        	return (<div className="thumbnail">
				{label}
		    </div>)
        }).bind(this);


        var {status, progress} = this.state.param;
    	switch(status){
    		case 0:
    			return getLoadingDom(this.state.param);
    			break;
			case 1:
				return getDom(this.state.param);
				break;
			case 2:
				return getFailDom();
    	}
	}
})
module.exports = Thumbnail;