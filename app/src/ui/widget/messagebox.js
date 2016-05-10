/*** how to use this widget:
    var callback = function (clickedButtonIndex) {
        // @clickedButtonIndex, -1 = close
    };
    var msgBox = MessageBox.create("hello world !",["OK","Cancel"],0,{title:"test",disablemask:true});
    msgBox.show(callback);
***/
import './messagebox.css';
var MessageBox = React.createClass({
  getInitialState: function() {
        return {
             msg: '',
             title: '',
             disablemask: false,
             contentsSelectable: false,
             tabindex: 0,
             okHandler: function(){},
             isShow: false,
        }
    },
    onOKBtnClk: function() {
        this.state.okHandler();
        this.hide();
    },

    hide: function() {
        this.setState({
            isShow: false,
        })
    },
    render: function() {
        if(!this.state.isShow)
            return null;

        var msg = this.state.msg;
        var title = this.state.title;
        var disablemask = this.state.disablemask;
        var contentsSelectable = this.state.contentsSelectable;
        var tabindex = this.state.tabindex;
        var okHandler = this.state.okHandler;
        var okBtnLabel = '确定';
        var cancelBtnLabel = '取消';

        return (
            <div id='MsgBoxWrapper' className='MsgBox'>
                <div id='MsgBoxOverLay' className='MsgBoxOverLay' onClick={this.hide}></div>
                <div className='MsgBoxMain'>
                    <div className='MsgBoxHeader'>
                        <h2 className='title'>{title}</h2>
                        <span className='closebtn' onClick={this.hide}>
                            <a href='javascript:void(0);' id='closemsgboxbtn'>X</a>
                        </span>
                    </div>
                    <div className='MsgBoxContent'>
                        <p className='msgContentclassNamees'>{msg}</p>
                    </div>
                    <div className='MsgBoxBtns'>
                        <button className='btn btn-primary msgboxactive' onClick={this.onOKBtnClk}>{okBtnLabel}</button>
                        <button className='btn btn-default msgboxdefault' onClick={this.hide}>{cancelBtnLabel}</button>
                    </div>
                </div>
            </div>
        );
     
    }
});

module.exports = MessageBox;
