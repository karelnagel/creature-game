import React, { Component } from 'react';

class Start extends Component {
  render() {
    return (
      <section className='start'>
        <h2>Welcome</h2>
        <p className='p1'>
          How well do you know Creature World Twitter community?
          <br/>
          <br/>
          In this game, you have to match a creature's Twitter handle and their creature image. 
          If you collect all Creatures you will get the final Tomato NFT and get to write your message to the Wall of Fame, where it will stay forever.
          <br/>
          After finishing you can choose to burn all collected creature NFTs, if you don't want them to spam your Opensea, but the Tomato NFT will still stay in your wallet.
          <br/>
          Don't forget to follow all the Creatures!
        </p>
        <button className='btn' onClick={this.props.play}>
          Let's play
        </button>
      </section>
    );
  }
}

export default Start;