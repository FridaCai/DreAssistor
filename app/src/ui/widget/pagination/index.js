var Pagination = React.createClass({
  getInitialState(){
    var {curPage, totalPage} = this.props;
    var limit = 4;
    var offset = Math.floor(curPage/limit);
    
    return {
      offset: offset, //which group
      limit: limit,
      curPage: curPage,
      totalPage: totalPage
    }
  },
  onPrevBtnClk(){
    var offset = this.state.offset;
    this.setState({
      offset: offset -1
    })
  },
  onNextBtnClk(){
    var offset = this.state.offset;
    this.setState({
      offset: offset + 1
    })
  },
  onPagination(curPage){
    this.props.onPagination(curPage); 
  },
  componentWillReceiveProps: function(newProp){
        this.setState({
          offset:0,
          curPage: newProp.curPage,
          totalPage: newProp.totalPage
        })
  },
  render(){
    var {curPage, totalPage, limit, offset} = this.state;


    var showPrevBtn = (offset!=0);

    var maxOffset = Math.ceil(totalPage/limit) -1;
    var showNextBtn = (offset < maxOffset);
            

    var prevBtnStyle = showPrevBtn ? {visibility:'visible'} : {visibility:'hidden'};
    var nextBtnStyle = showNextBtn ? {visibility:'visible'} : {visibility:'hidden'};

    var paginationDOM = (function(){
      var dom = [];
      var loop = (offset === maxOffset ? totalPage%limit : limit);

      for(var i=0; i<loop; i++){
        var pageNum = offset*limit+i; 

        var className = '';
        if(pageNum === curPage){
          className = 'active';
        }

        dom.push((<li key={pageNum} className={className}> 
          <a href="javascript:void(0);" 
            onClick={this.onPagination.bind(this, pageNum)}>
            {pageNum + 1}
          </a>
        </li>));
      }
      return dom;
    }).call(this);

    return (
      <nav aria-label="Page navigation" style={{textAlign: 'center'}}>
        <ul className="pagination">

          <li style={prevBtnStyle}>
            <a href="javascript:void(0);" aria-label="Previous" onClick={this.onPrevBtnClk}>
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          {paginationDOM}
          <li style={nextBtnStyle}>
            <a href="javascript:void(0);" aria-label="Next" onClick={this.onNextBtnClk}>
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    )
  }
})
module.exports = Pagination;