import {sigal_window_resizeend} from '../../../api.js';
import {ExpandLine} from 'Table';
import {LineDOM} from 'Table';
import {CellDOM} from 'Table';
import {ExpandLineDOM} from 'Table';
import API from './api.js';

import './style.less';

var TableDOM = React.createClass({
	getInitialState: function() {
        return {
        	sheetIndex: 0,
        	uidata: this.props.uidata,
            onDrop: this.props.onDrop || function(){},
            isReverse: this.props.isReverse,
        };
    },
    onSwitchSheet: function(index){
        this.update({
            sheetIndex: index,
        });
    },  
    onExpandToggle: function(e, param){
        var {isOpen, cell} = param;

        var line = cell.line;
        line.updateByExpand(isOpen, cell);

        var expandLine = line.expandLine;
        expandLine.updateByExpand(isOpen, cell);

        this.forceUpdate();
    },
    componentDidMount: function(){
        sigal_window_resizeend.listen(this.updateAfterRender);
        API.signal_expand_toggle.listen(this.onExpandToggle);
    },
    
    componentWillUnmount: function(){
        sigal_window_resizeend.unlisten(this.updateAfterRender);
        API.signal_expand_toggle.unlisten(this.onExpandToggle);
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

    getNonReverseTableDom:function(ui){
        var getSheetDom = (function(sheet){
                var dom = [];

                var lines = [];
                for(var i=0; i<sheet.length; i++){
                    var line = sheet[i];                    
                    lines.push(line);
                }

                for(var i=0; i<lines.length; i++){
                    var line = lines[i];
                    if(line instanceof ExpandLine){
                        dom.push(<ExpandLineDOM line={line} key={line.id}/>);
                    }else{
                        dom.push(<LineDOM line={line} key={line.id}/>);    
                    }
                    
                }
                return dom;
            }).bind(this);

            var getHeaderDom = (function(header){
                return (<LineDOM line={header} key={header.id}/>)
            }).bind(this);

        return (
            <table>
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
        var headers = ui.headers[this.state.sheetIndex];
        var sheets = ui.sheets[this.state.sheetIndex];


        if(sheets.length === 0)
            return;

        var table = [];
        var rowNum = headers.cells.length;
        var columnNum = sheets.length;




        for(var i=0; i<rowNum; i++){
            var line = [];

            line.push(headers.cells[i]);
            for(var j=0; j<columnNum; j++){
                line.push(sheets[j].cells[i]);
            }
            table.push(line);
        }


        return (
            <table>
                {
                    table.map(function(line){
                        return (<tr>
                        {
                            line.map(function(cell){ //todo: width style.
                                return (<CellDOM cell={cell}/>)
                            })
                        }
                        </tr>)
                    })
                }

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

