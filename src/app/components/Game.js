import React, { Component } from 'react';

class Game extends Component {
  render() {
    return (
      <section className='game'>
        <h3>Which one of these creatures is</h3>
        <h2 >
          <a href={`https://twitter.com/${this.props.currentToken.name}`} target="_blank" rel="noopener noreferrer">@{this.props.currentToken.name}</a>
        </h2>

        <div className='game-pictures'>
          {this.props.currentPictures.map((picture) => {
            return (<img width='100' src={require(`../images/${picture.name}.jpg`)} alt='' onClick={() => this.props.select(picture.id)} key={picture.id} />)
          })}
        </div>
      </section>
    );
  }
}

export default Game;