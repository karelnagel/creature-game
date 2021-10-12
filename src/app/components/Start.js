import React, { Component } from 'react';

class Start extends Component {
  render() {
    return (
      <section className='start'>
        <h2>Welcome</h2>
        <p className='p1'>
          This game shows you, how well you know Creature World Twitter community. 
          <br/>
          You have to match user Twitter handle and their Creature image. 
          If you collect all Creatures you will get the final Tomato NFT and get to write your message to the Wall of Fame, where it will stay forever.
          <br/>
          After finishing you can choose to burn all collected Creature NFTs, if you don't want them to spam your Opensea, but the Tomato NFT will still stay in your wallet.
        </p>
        <button className='btn' onClick={this.props.play}>
          Let's play
        </button>
      </section>
    );
  }
}

export default Start;