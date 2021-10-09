import React, { Component } from 'react';

class Game extends Component {
    render() {
        return (<section className='start'>
        <h2>Welcome</h2>
        <p>
        You are playing find the creatures face. You will be given a creature twitter handle and you have to choose their creature, If you choose right then you can mint it in polygon network as a NFT. When you collect all tokens then you will be given the final token and you can write your message to the Hall of Fame which will be visible to everyone and will stay there forever. After collecting all you also have a option to burn the other unecessary 90 tokens to keep your opensea wallet clean.
        </p>
        <button className='btn' onClick={this.props.play}>
          Lets play
        </button>
      </section>);
    }
}

export default Game;