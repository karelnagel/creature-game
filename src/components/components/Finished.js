import React, { Component } from 'react';

class Finished extends Component {
  render() {
    return (
      <section>
        <h2>Congratulations you collected them all!!!</h2>
        <div className="finished">
          <img src="/images/0.jpg" alt="" />
          {(this.props.canReview || this.props.canBurn) &&
            <div>
              {this.props.canReview &&
                <form>
                  <input type="text" placeholder='Add your message to the Wall of Fame' onChange={this.props.handleInputChanged.bind(this)} />
                  <button className='btn' onClick={this.props.leaveReview.bind(this)}>
                    Submit
                  </button>
                </form>
              }
              {this.props.canBurn &&
                <div>
                  <p>If you don’t want to see all the 90 useless tokens in your opensea wallet and keep only the last one then press ‘burn’</p>
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