var Pagination = React.createClass({



  getInitialState(){
    return {
      curPage: this.props.curPage,
      totalPage: this.props.totalPage,
      limit: 10,
      offset: 0, //which group
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
    //do something
    this.props.onPagination(curPage); 
  },
  render(){
    var {curPage, totalPage,limit,offset} = this.state;


    var showPrevBtn = (this.state.offset!=0);

    var maxOffset = Math.ceil(totalPage/limit) -1;
    var showNextBtn = (this.state.offset < maxOffset);
            

    var prevBtnStyle = showPrevBtn ? {visibility:'show'} : {visibility:'hidden'};
    var nextBtnStyle = showNextBtn ? {visibility:'show'} : {visibility:'hidden'};

    var paginationDOM = (function(){
      var dom = [];
      console.log('check unique key');
      for(var i=0; i<limit; i++){
        var curPage = offset*limit+i; 
        console.log(curPage);
        dom.push((<li key={curPage}>
          <a href="javascript:void(0);" 
            onClick={this.onPagination.bind(this, curPage)}>
            {curPage+1}
          </a>
        </li>));
      }
      return dom;
    }).call(this);

    return (
      <nav aria-label="Page navigation" style={{textAlign: 'center'}}>
        <ul className="pagination">

          <li style={prevBtnStyle}>
            <a href="#" aria-label="Previous" onClick={this.onPrevBtnClk}>
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          {paginationDOM}
          <li style={nextBtnStyle}>
            <a href="#" aria-label="Next" onClick={this.onNextBtnClk}>
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    )
  }
})
module.exports = Pagination;