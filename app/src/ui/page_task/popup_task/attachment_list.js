import Attachment from '../data/attachment.js';
import Util from '../../../util.js';

var AttachmentList = React.createClass({
  getInitialState: function(){
    return {
      task: this.props.task,
    }
  },

  onAddAttachmentClk: function(){
    this.refs.fileElem.click();
  },
  fileElemChange: function(e){
    e.preventDefault();
    //call service to upload file.
    var files = e.target.files;
    debugger;

    for(var i=0; i<files.length; i++){
      var file = files[i];
      var label = file.name;
      var attachment = new Attachment();
      attachment.init({
        id: Util.generateUUID(),
        label: label,
        url: '',
      })
      this.state.task.addAttachment(attachment);
    }
    this.forceUpdate();
  },

  onDelete: function(id){
    this.state.task.deleteAttachment(id);
    this.forceUpdate();
  },
  render: function(){
    var attachments = this.state.task.attachments;
      return (
          <div className='attachmentList listContainer'>
              <ul className="list-group">
                {
                  attachments.map((function(attachment){
                    var label = attachment.label;
                    var id = attachment.id;

                    return (
                      <li className="list-group-item" key={id}>
                        {label}
                        <div className='buttonGroup'>
                            <button className='btn btn-default deleteBtn' onClick={this.onDelete.bind(this, id)}>Delete</button>
                        </div>
                      </li>
                    )
                  }).bind(this))
                }
              </ul>
              <a href='javascript:void(0);' onClick={this.onAddAttachmentClk}>添加附件</a>


            <form>
              <input type="file" ref="fileElem" multiple accept="*/*" onChange={this.fileElemChange}/>
            </form>
          </div>
      )
    }
});
module.exports = AttachmentList;
