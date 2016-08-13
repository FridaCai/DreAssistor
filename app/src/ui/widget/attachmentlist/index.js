import Util from 'Util';

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
    //call service to upload file.
    var files = e.target.files;

    for(var i=0; i<files.length; i++){
      var file = files[i];
      var label = file.name;
      
      var attachment = {
        id: Util.generateUUID(),
        label: label,
        url: '',
      }
      this.state.attachments.add(attachment);
    }
    this.forceUpdate();
  },

  onDelete: function(id){
    this.state.attachments.deleteById(id);
    this.forceUpdate();
  },
  render: function(){
    var attachments = this.state.attachments;
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
                        <button className='btn btn-default deleteBtn' onClick={this.onDelete.bind(this, id)}>Delete</button>
                      </li>
                    )
                  }).bind(this))
                }
              </ul>
              <a href='javascript:void(0);' onClick={this.onAddClk}>添加附件</a>

            <form className='upload'>
              <input type="file" ref="fileElem" multiple accept="*/*" onChange={this.fileElemChange}/>
            </form>
          </div>
      )
    }
});
module.exports = AttachmentList;
