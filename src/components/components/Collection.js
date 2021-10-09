import React, { Component } from 'react';

class Collection extends Component {
  render() {
    return (<section>
      <h2>Collected creatures {this.props.tokensOwned.length} / {this.props.maxBalance.toString()}:</h2>
      <div className="collection">
        {this.props.tokensOwned.map((tokenId) => {
          let info = this.props.tokens.find((token) => token.id === tokenId)
          return (
            <a href={`https://twitter.com/${info.name}`}>
              <img
                width="50"
                alt=''
                key={tokenId}
                src={info.image}
              />
              <p>{info.name}</p>
            </a>
          )
        })}
      </div>
    </section>);
  }
}

export default Collection;