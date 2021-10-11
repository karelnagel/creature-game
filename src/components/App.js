import React, { Component } from 'react';
import './App.css';
import CreatureToken from '../abis/CreatureToken.json'
import axios from 'axios';
import Game from './components/Game';
import Finished from './components/Finished';
import Collection from './components/Collection';
import Reviews from './components/Reviews';
import Nav from './components/Nav';
import Start from './components/Start'
import Helpers from './helpers'

class App extends Component {
  //helpers = new Helpers('0x89', 'https://polygon-rpc.com');
  helpers = new Helpers('0x5','https://goerli.prylabs.net')

  async componentWillMount() {
    await this.helpers.loadWeb3()
    var token = await this.helpers.getToken(CreatureToken)
    if (token)
      await this.loadBlockchainData(token)
    else
      window.alert('You are using wrong chain')
    if (!this.state.finished) await this.getRandomToken()
    this.setState({ loading: false })
  }

  async loadBlockchainData(token) {
    const maxBalance = await token.methods.maxBalance().call()

    //For everyone
    let tokens = []
    for (let i = 1; i <= maxBalance; i++) {
      let response = await axios.get(`json/${i}.json`)
      tokens.push({ id: i.toString(), name: response.data.name, image: response.data.image })
    }
    console.log(tokens)
    let reviews = [];
    let reviewCount = await token.methods.reviewCount().call()
    for (let i = 0; i < reviewCount; i++) {
      let review = await token.methods.reviews(i).call()
      reviews.push(review)
    }

    //For only those in correct eth network
    let tokensOwned = []
    let showStart = true
    let finished = false
    let canReview = false
    let account,ens

    if (this.state.playWithMinting) {
      [account, ens] = await this.helpers.getAddressAndEns();

      for (let i = 1; i <= maxBalance; i++) {
        let result = await token.methods.balanceOf(account, i).call()
        if (result.toString() === '1') {
          tokensOwned.push(i.toString())
        }
      }
      if (tokensOwned.length > 0) showStart = false;
      let finalToken = await token.methods.balanceOf(account, 0).call()
      finished = finalToken.toString() === '1'

      canReview = !await token.methods.userLeftReview(account).call()
    }

    this.setState({ tokensOwned, tokens, reviews, canReview, finished, account, token, maxBalance, showStart, ens })
  }

  select = async (id) => {
    if (this.state.currentToken.id === id) {
      alert('Correct')
      if (this.state.playWithMinting)
        await this.mint(id)
      else {
        this.state.tokensOwned.push(id.toString())

        if (this.state.tokensOwned.length.toString() === this.state.maxBalance.toString()) {
          this.setState({ finished: true })
        }
        else
          this.getRandomToken()
      }
    }
    else {
      alert("Wrong!")
      this.getRandomToken()
    }
  }
  mint = async (id) => {
    await this.state.token.methods.mint(id)
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {

        this.state.tokensOwned.push(id.toString())

        //Check if finished
        if (this.state.tokensOwned.length.toString() === this.state.maxBalance.toString()) {
          this.setState({ finished: true })
        }
        else
          this.getRandomToken()
      })
  }

  async leaveReview() {
    var text = this.state.reviewText;

    this.setState({ canReview: false })
    await this.state.token.methods.leaveReview(text)
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        this.state.reviews.push(text.toString())
        this.setState({ reviews: this.state.reviews })
      })
  }

  handleInputChanged(event) {
    this.setState({
      reviewText: event.target.value
    });
  }

  getRandomToken() {
    // Getting twitter name 
    let notFoundTokens = []
    console.log(this.state.tokens)
    this.state.tokens.forEach(element => {
      if (!this.state.tokensOwned.includes(element.id))
        notFoundTokens.push(element)
    });
    let currentToken = this.shuffle(notFoundTokens)[0]

    //getting 5 random pictures
    let allTokens = this.state.tokens
    allTokens = allTokens.filter((token) => token.id !== currentToken.id)
    let currentPictures = this.shuffle(allTokens).splice(0, 4)
    currentPictures.push(currentToken)
    currentPictures = this.shuffle(currentPictures)
    this.setState({ currentPictures, currentToken })

  }

  shuffle(array) {
    return array.sort((a, b) => 0.5 - Math.random())
  }

  async burn() {
    let ids = []
    let values = []
    for (let i = 1; i <= this.state.maxBalance; i++) {
      let balance = await this.state.token.methods.balanceOf(this.state.account, i).call()
      if (balance > 0) {
        ids.push(i)
        values.push(balance)
      }
    }

    await this.state.token.methods.burnBatch(this.state.account, ids, values)
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        this.setState({ tokensOwned: [] })
      })
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      finished: false,
      playWithMinting: true,
      account: '0x0',
      ens: '',
      token: null,
      maxBalance: 0,
      tokensOwned: [],
      tokens: [],
      currentToken: {},
      currentPictures: {},
      reviews: [],
      canReview: true,
      reviewText: '',
      showStart: true,
    }
  }

  render() {
    if (this.state.loading) return (<div></div>);
    return (
      <main>
        <Nav
          account={this.state.ens ? this.state.ens : this.state.account}
          error={!this.state.playWithMinting}
        />
        <div className='top'>
          <div className="top-box">
            {!this.state.finished
              ?
              this.state.showStart ?
                <Start
                  play={() => this.setState({ showStart: false })}
                /> :
                <Game
                  currentToken={this.state.currentToken}
                  currentPictures={this.state.currentPictures}
                  select={this.select}
                />
              :
              <Finished
                canReview={this.state.canReview}
                handleInputChanged={this.handleInputChanged}
                leaveReview={this.leaveReview}
                burn={this.burn}
                canBurn={this.state.tokensOwned > 0}
              />
            }
          </div>
        </div>
        <div className='bottom'>
          <div className="white-box">
            <Collection
              tokensOwned={this.state.tokensOwned}
              tokens={this.state.tokens}
              maxBalance={this.state.maxBalance}
            />
          </div>
          <div className="white-box">
            <Reviews
              reviews={this.state.reviews}
            />
          </div>
        </div>
        <footer>
          <a href="https://twitter.com/KarelETH">
            <p>Opensea</p>
          </a>
          <a href="https://twitter.com/KarelETH">
            <p>Github</p>
          </a>
          <a href="https://twitter.com/KarelETH">
            <p>Twitter</p>
          </a>
          <a href="https://twitter.com/KarelETH">
            <p>Contract</p>
          </a>
        </footer>
      </main>
    );
  }
}

export default App;