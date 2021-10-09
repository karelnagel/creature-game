import React, { Component } from 'react';

class Nav extends Component {
  render() {
    return (
      <div className='nav-bar'>
      <nav>
        <div>
          <h1>Creature game</h1>
          <p>
            {this.props.account}
          </p>
        </div>
      </nav>
      {this.props.error &&
          <div className='error'>
            You aren't connected to correct network or don't have eth browser, but you can still play without minting.
          </div> 
        }
      </div>);
  }
}

export default Nav;