import React, { Component } from 'react';

class Nav extends Component {
  render() {
    let length = this.props.account.length
    return (
      <div className={`nav-bar ${this.props.correctOrWrong}`} >
        <nav>
          <div>
            <h1>Creature Game</h1>
            <h1>
              {
                this.props.ens
                  ?
                  this.props.ens
                  :
                  `${this.props.account.substring(0, 5)}.....${this.props.account.substring(length - 5, length)}`
              }
            </h1>
          </div>
        </nav>

      </div>
    );
  }
}

export default Nav;