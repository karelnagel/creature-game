import React, { Component } from 'react';

class Reviews extends Component {
    render() {
        return (<section className="reviews">
        <h2>Wall of fame</h2>
        <div className="reviews-text">
          {
          this.props.reviews.map((review,i) => {
            return (<p key={i}>{`${i+1}. ${review}`}</p>)
          })}
        </div>
      </section>);
    }
}

export default Reviews;