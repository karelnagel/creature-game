import React, { Component } from 'react';

class Game extends Component {
    render() {
        return (<section className='game'>
        <h3>Which one of these creatures is</h3>
        <a href={`https://twitter.com/${this.props.currentToken.name}`}>
          <h2>@{this.props.currentToken.name}</h2>
        </a>

        <div className='game-pictures'>
          {this.props.currentPictures.map((picture) => {
            return (<img width='100' src={picture.image} alt='' onClick={() => this.props.select(picture.id)} />)
          })}
        </div>
      </section>);
    }
}

export default Game;