import {sigal_window_resizeend} from '../../../api.js';
import {LineGroup} from 'Table';
import {LineDOM} from 'Table';
import './style.less';

var TableDOM = React.createClass({
	getInitialState: function() {
        return {
        	sheetIndex: 0,
        	uidata: this.props.uidata,
            onDrop: this.props.onDrop || function(){},
        };
    },
    onSwitchSheet: function(index){
        this.update({
            sheetIndex: index,
        });
    },  

    componentDidMount: function(){
        sigal_window_resizeend.listen(this.updateAfterRender);
    },
    
    componentWillUnmount: function(){
        sigal_window_resizeend.unlisten(this.updateAfterRender);
    },

    _$: function(selector){
        if(!selector)
            return $(ReactDOM.findDOMNode(this));
        else return $(ReactDOM.findDOMNode(this)).find(selector);
    },

    updateAfterRender: function(){
        (function updateTableBodyHeight(){
            var h = $('.projectPopupContainer .MsgBoxContent').height()
                        - $('.addOn').outerHeight() 
                        - parseInt($('.addOn').css('marginTop')) 
                        - parseInt($('.dataTable').css('marginTop'))
                        - $('.nav-tabs').outerHeight()
                        - $('.thead-inverse').outerHeight();
            $('tbody').height(h);
        }).call(this)
    },

    onDrop: function(e){//for edit case, do nothing for drop.
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files;
        this.state.onDrop(files);
    },

    onDragOver(e){e.preventDefault();},

    update:function(param){
        this.setState(param, this.updateAfterRender);
    },

    render:function(){
        try{
            if(!this.state.uidata){
                return null;
            }

            var ui = (function(uidata){
                var sheetNames = [];
                var sheets = [];
                var headers = [];

                Object.keys(uidata).map(function(key){
                    sheetNames.push(uidata[key].sheetName);
                    sheets.push(uidata[key].ui);
                    headers.push(uidata[key].header);
                })
                return {
                    sheetNames: sheetNames,
                    sheets: sheets,
                    headers: headers
                }
            })(this.state.uidata);
            
            var getSheetDom = (function(sheet){
                var dom = [];

                var lines = [];
                for(var i=0; i<sheet.length; i++){
                    var line = sheet[i];
                    if(line instanceof LineGroup){
                        lines = lines.concat(line.lines);
                    }else{
                        lines.push(line);
                    }
                }

                for(var i=0; i<lines.length; i++){
                    var line = lines[i];
                    dom.push(
                        <LineDOM line={line} key={line.id}/>
                    );
                }
                return dom;
            }).bind(this);

            var getHeaderDom = (function(header){
                return (<LineDOM line={header} key={header.id}/>)
            }).bind(this);
            
            return (
                <div className='panel-body dataTable' onDragOver={this.onDragOver} onDrop={this.onDrop}>
                        <ul className="nav nav-tabs">
                        {
                            ui.sheetNames.map((function(sheetName, index){
                                if(!sheetName)
                                    return null;
                                
                                var className = (index === this.state.sheetIndex ? 'active': '');
                                return (
                                    <li role="presentation" className={className} key={index.toString()} onClick={this.onSwitchSheet.bind(this, index)}>
                                        <a href="javascript:void(0);">{sheetName}</a>
                                    </li>
                                )
                            }).bind(this))
                        }
                        </ul>
                        <div className='sheet'>
                            <table>
                                <thead className="thead-inverse" ref='tableHeader'>
                                    {getHeaderDom(ui.headers[this.state.sheetIndex])}
                                </thead>
                                <tbody ref='tableBody'>
                                    {getSheetDom(ui.sheets[this.state.sheetIndex])}
                                </tbody>
                            </table>
                        </div>
                </div>
            )
        }catch(e){
            console.log(e.stack);
        }
    },
})
module.exports = TableDOM;

