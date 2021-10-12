import React, { Component } from 'react';
class Reviews extends Component {

  stringToTwitter(review, i) {
    let start = review.indexOf("@",)
    let end =review.indexOf(" ", start)
    if (end===-1)
      end=review.length
    console.log(end)
    var mySubString = review.substring(start + 1,end);
    return (
      <p key={i} className='p1'>
        {i}.
        {review.substring(0,start)}
        <a href={`https://twitter.com/${mySubString}`} target="_blank" rel="noopener noreferrer">{mySubString}</a>
        {review.substring(end,review.length)}
      </p >
    )
  }

  render() {
    return (
      <section className="reviews">
        <h2>Wall of Fame</h2>
        <div className="reviews-text">
          {
            this.props.reviews.map((review, i) => {
              return (this.stringToTwitter(review,i))
            })}
        </div>
      </section>
    );
  }
}

export default Reviews;