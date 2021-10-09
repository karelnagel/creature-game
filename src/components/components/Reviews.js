import React, { Component } from 'react';

class Reviews extends Component {
    render() {
      let counter=0;
        return (<section className="reviews">
        <h2>Wall of fame</h2>
        <div className="reviews-text">
          {
          this.props.reviews.map((review) => {
            counter++;
            return (<p>{`${counter}. ${review}`}</p>)
          })}
        </div>
      </section>);
    }
}

export default Reviews;