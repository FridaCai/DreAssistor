/*** how to use this widget:
    var callback = function (clickedButtonIndex) {
        // @clickedButtonIndex, -1 = close
    };
    var msgBox = MessageBox.create("hello world !",["OK","Cancel"],0,{title:"test",disablemask:true});
    msgBox.show(callback);
***/
import './messagebox.css';
import CreateProjectPopup from '../page_projecttime/view/popup_createproject.js'

var MessageBox = React.createClass({
  getInitialState: function() {
        return {
             title: '',
             disablemask: false,
             contentsSelectable: false,
             tabindex: 0,
             msg: '',
             
             content: this.props.content || undefined,
             okHandler: this.props.okHandler || function(){},
             

             isShow: false,
        }
    },
    show: function(content) {
        this.setState({
            isShow: true,
            content: content,
        })
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
    getContent: function(){
        debugger;
        if(this.state.content){
            return (this.state.content);
        }
        return (
            <p className='msgContentclassNamees'>{this.state.msg}</p>
        )
    },

    render: function() {
        if(!this.state.isShow)
            return null;

        var title = this.state.title;
        var disablemask = this.state.disablemask;
        var contentsSelectable = this.state.contentsSelectable;
        var tabindex = this.state.tabindex;
        var okHandler = this.state.okHandler;
        var okBtnLabel = '确定';
        var cancelBtnLabel = '取消';

        var content = this.props.children;
        
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
                        {content}
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
