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
             title: this.props.title || '',
             disablemask: false,
             contentsSelectable: false,
             tabindex: 0,
             msg: this.props.msg || '',
             okHandler: this.props.okHandler || function(){},
             isShow: false,
             width: this.props.width || 400,
             cName: this.props.cName,
             hideFooter: this.props.hideFooter
        }
    },
    componentWillReceiveProps: function(newProps) {
        this.setState({
            title: newProps.title,
            width: newProps.width,
            okHandler: newProps.okHandler,
        }); 
    },

    show: function() {
        this.setState({
            isShow: true,
        })
    },
    onOKBtnClk: function() {
        this.state.okHandler().then((function(){
            this.hide();    
        }).bind(this));
    },

    hide: function() {
        this.setState({
          isShow: false,
        })
    },
    getContent: function(){
        if(this.props.children){
            return this.props.children;
        }
        return(
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

        var content = this.getContent();

      
        var className = `MsgBox ${this.state.cName}`;

        var getFooterDom = (function(){
            if(this.state.hideFooter){
                return null
            }

            return (
                <div className='MsgBoxBtns'>
                    <button className='btn btn-primary msgboxactive' onClick={this.onOKBtnClk}>{okBtnLabel}</button>
                    <button className='btn btn-default msgboxdefault' onClick={this.hide}>{cancelBtnLabel}</button>
                </div>
            )
        }).bind(this);

        return (
            <div id='MsgBoxWrapper' className={className}>
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
                    {getFooterDom()}
                </div>
            </div>
        );
     
    }
});

module.exports = MessageBox;
