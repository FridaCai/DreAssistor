var AttachmentList = React.createClass({
    render: function(){
        return (
            <div className='listContainer'>
                <ul className="list-group">
                  <li className="list-group-item">
                    Cras justo odio
                    <div className='buttonGroup'>
                        <button className='btn btn-default deleteBtn'>Delete</button>
                    </div>
                  </li>
                  <li className="list-group-item">Dapibus ac facilisis in</li>
                  <li className="list-group-item">Morbi leo risus</li>
                  <li className="list-group-item">Porta ac consectetur ac</li>
                  <li className="list-group-item">Vestibulum at eros</li>
                </ul>
                <a href='javascript:void(0);'>添加附件</a>
            </div>
        )
    }
});
module.exports = AttachmentList;
