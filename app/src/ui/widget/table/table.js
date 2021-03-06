import {sigal_window_resizeend} from 'api';
import {ExpandLine} from 'Table';
import {LineDOM} from 'Table';
import {CellDOM} from 'Table';
import {ExpandLineDOM} from 'Table';
import Util from 'Util';
import {LineGroup} from 'Table';
import {Line} from 'Table';


import './style.less';

var TableDOM = React.createClass({
	getInitialState: function() {
        return {
        	sheetIndex: 0,
        	uidata: this.props.uidata,
            onDrop: this.props.onDrop || function(){},
            isReverse: this.props.isReverse,
            needUpdate: this.props.needUpdate || false,
        };
    },
    onSwitchSheet: function(index){
        if(this.props.onSwitchSheet){
            this.props.onSwitchSheet();
        }
        this.update({
            sheetIndex: index,
        });
    },  
    getSheetIndex:function(){
        return this.state.sheetIndex;
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
        if(!this.state.needUpdate)
            return;
        if(this.state.isReverse){
            return;
        }

        (function updateTableBodyHeight(){
            var h = $('.projectPopupContainer .MsgBoxContent').height()
                        - $('.xlsIExport').outerHeight() 
                        - parseInt($('.xlsIExport').css('marginTop')) 
                        - parseInt($('.dataTable').css('marginTop'))
                        - $('.nav-tabs').outerHeight()
                        - $('.thead-inverse').outerHeight();
            this._$('>.sheet >.customTable >tbody').height(h);
        }).call(this)
    },

    onDrop: function(e){
        if(this.props.isReadOnly)
            return;
        
        e.stopPropagation();
        e.preventDefault();
        this.state.onDrop(e.dataTransfer);
    },

    onDragOver(e){e.preventDefault();},

    update:function(param){
        if(param){
            this.setState(param, this.updateAfterRender);    
        }else{
            this.forceUpdate(this.updateAfterRender);
        }
    },

    getNonReverseTableDom:function(ui){
        var getSheetDom = (function(sheet){
            var dom = [];

            var lines = [];
            for(var i=0; i<sheet.length; i++){
                var line = sheet[i];                    


                if(line instanceof LineGroup){
                    var lineGroup = line;
                    lineGroup.lines.map(function(l){
                        lines.push(l);
                    })
                }else if(line instanceof Line){
                    lines.push(line);
                }
            }

            for(var i=0; i<lines.length; i++){
                var line = lines[i];
                var key = line.id + '_' + Util.generateUUID(); 
                if(line instanceof ExpandLine){
                    dom.push(<ExpandLineDOM line={line} key={key} isReadOnly={this.props.isReadOnly}/>);
                }else{
                    dom.push(<LineDOM line={line} key={key} isReadOnly={this.props.isReadOnly}/>);    
                }
            }
            return dom;
        }).bind(this);

        var getHeaderDom = (function(header){
            if(!header.cells || header.cells.length==0)
                return null;
            return (<LineDOM line={header} key={header.id} isReadOnly={this.props.isReadOnly}/>)
        }).bind(this);

        return (
            <table className='customTable'>
                <thead className="thead-inverse" ref='tableHeader'>
                    {getHeaderDom(ui.headers[this.state.sheetIndex])}
                </thead>
                <tbody ref='tableBody'>
                    {getSheetDom(ui.sheets[this.state.sheetIndex])}
                </tbody>
            </table>

        )
    },
    getReverseTableDom: function(ui){
        var getSheetDom = (function(){
            var headers = ui.headers[this.state.sheetIndex];
            var sheets = ui.sheets[this.state.sheetIndex];


            if(sheets.length === 0)
                return;

            var dom = [];
            var rowNum = headers.cells.length;
            var columnNum = sheets.length;

            for(var i=0; i<rowNum; i++){
                var cells = [];

                var headerCell = headers.cells[i];
                !headerCell.isHide && cells.push(headerCell);

                for(var j=0; j<columnNum; j++){
                    var cell = sheets[j].cells[i];
                    !cell.isHide && cells.push(cell);
                }
                //cannot new Column and ColumnDOM.
                //cannot use ColumnDOM since cannot draw table using column by html nature.
                var line = {
                    cells: cells
                }

                var key = Util.generateUUID(); 
                dom.push(<LineDOM line={line} key={key} isReadOnly={this.props.isReadOnly}/>);    
            }
            return dom;
        }).bind(this);

        return (
            <table className='customTable'>
                <tbody>
                {getSheetDom.call(this)}
                </tbody>
            </table>
        )
    },
    getTableDom:function(ui){
        if(this.state.isReverse){
            return this.getReverseTableDom(ui);
        }else{
            return this.getNonReverseTableDom(ui);
        }
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
                            {this.getTableDom(ui)}
                        </div>
                </div>
            )
        }catch(e){
            console.log(e.stack);
        }
    },
})

module.exports = TableDOM;

