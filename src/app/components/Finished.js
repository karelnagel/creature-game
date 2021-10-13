import React, { Component } from 'react';

class Finished extends Component {
  render() {
    return (
      <section>
        <h2>Congratulations you collected them all!!!</h2>
        <div className="finished">
          <a href="https://opensea.io/assets/matic/0x3eb45bdabe55602f3eb1e71c94ec641b6fe26a3e/0" target="_blank" rel="noopener noreferrer">
          <img src={require(`../images/0.jpg`)} alt="" />
          </a>
          {(this.props.canReview || this.props.canBurn) &&
            <div>
              {this.props.canReview &&
                <div>
                  <p className='p1'>Add your message to the Wall of Fame. You can leave only one message and it can't be changed. To mention your twitter user put @ before your username.</p>
                  <input type="text" placeholder='I really liked the game @KarelETH' onChange={this.props.handleInputChanged.bind(this)} />
                  <button className='btn' onClick={this.props.leaveReview.bind(this)}>
                    Add
                  </button>
                </div>
              }
              {this.props.canBurn &&
                <div className='finished-burn'>
                  <p className='p1'>
                    You can burn all the collected Creature tokens, to free your wallet, but the Tomato NFT will still stay in your wallet.
                    </p>
                  <button className='btn' onClick={this.props.burn.bind(this)}>Burn</button>
                </div>
              }
            </div>
          }
        </div>
      </section>
    );
  }
}

export default Finished;