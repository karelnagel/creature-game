import React, { Component } from 'react';
import './App.css';
import CreatureToken from '../abis/CreatureToken.json'
import Game from './components/Game';
import Finished from './components/Finished';
import Collection from './components/Collection';
import Reviews from './components/Reviews';
import Nav from './components/Nav';
import Start from './components/Start'
import Loading from './components/Loading'
import Helper from './components/Helper'


class App extends Component {
  helper = new Helper('0x89', 'https://polygon-rpc.com');

  async componentWillMount() {
    await this.helper.loadWeb3()
    var token = await this.helper.getToken(CreatureToken)

    this.setState({ token })
    if (token) {
      await this.loadBlockchainData(token)

      if (!this.state.finished) await this.getRandomToken()

      this.setState({ loading: false })
    }
  }

  async loadBlockchainData(token) {
    const maxBalance = await token.methods.maxBalance().call()

    //For everyone
    var tokensJson = require(`./tokens.json`)
    const tokens =tokensJson.map((token,i)=>{
      return {id:(i+1), name:token.name}
    })

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
    let account, ens
    let playWithMinting = true;

    [account, ens] = await this.helper.getAddressAndEns();
    let allTokensIds=[]
    let accounts=[]
    for (let i = 1; i <= maxBalance; i++) {
      allTokensIds.push(i)
      accounts.push(account)
    }
    let result = await token.methods.balanceOfBatch(accounts,allTokensIds).call()
    allTokensIds.forEach((token,i)=>{
      let balance = result[i].toString()
      if (balance!=='0') tokensOwned.push(token);
    })
    console.log('sadf',tokensOwned)

    if (tokensOwned.length > 0)
      showStart = false;
    let finalToken = await token.methods.balanceOf(account, 0).call()
    finished = finalToken.toString() === '1'

    canReview = !await token.methods.userLeftReview(account).call()
    playWithMinting = await token.methods.active().call()

    this.setState({ tokensOwned, tokens, reviews, canReview, finished, account, maxBalance, showStart, ens, playWithMinting })
  }

  select = async (id) => {
    if (this.state.currentToken.id === id) {
      if (!this.state.mintStarted.includes(id)) {
        var mintStarted = this.state.mintStarted
        mintStarted.push(id)
        this.setState({ mintStarted })
        this.setState({ correctOrWrong: 'nav-correct' })
        setTimeout(() => this.setState({ correctOrWrong: '' }), 500)
        if (this.state.playWithMinting)
          await this.mint(id)
        else {
          this.state.tokensOwned.push(id)

          if (this.state.tokensOwned.length.toString() === this.state.maxBalance.toString()) {
            this.setState({ finished: true })
          }
          else
            this.getRandomToken()
        }
      }
    }
    else {
      this.setState({ correctOrWrong: 'nav-wrong' })
      setTimeout(() => this.setState({ correctOrWrong: '' }), 500)
      this.getRandomToken()
    }
  }
  mint = async (id) => {

    await this.state.token.methods.mint(id)
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {

        this.state.tokensOwned.push(id)

        //Check if finished
        if (this.state.tokensOwned.length.toString() === this.state.maxBalance.toString()) {
          this.setState({ finished: true })
        }
        else
          this.getRandomToken()
      })

  }

  leaveReview = async () => {
    var text = this.state.reviewText;
    console.log(this.state.tokensOwned)
    this.setState({ canReview: false })
    await this.state.token.methods.leaveReview(text)
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        this.state.reviews.push(text.toString())
        this.setState({ reviews: this.state.reviews })
      })
  }

  handleInputChanged = (event) => {
    this.setState({
      reviewText: event.target.value
    });
  }

  getRandomToken() {
    // Getting twitter name 
    let notFoundTokens = []
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

  burn = async () => {
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
      mintStarted: [],
      tokens: [],
      currentToken: {},
      currentPictures: {},
      reviews: [],
      canReview: true,
      reviewText: '',
      showStart: true,
      correctOrWrong: '',
    }
  }

  render() {
    if (this.state.loading) return (<Loading />);
    return (
      <main>
        <Nav
          account={this.state.account}
          ens={this.state.ens}
          correctOrWrong={this.state.correctOrWrong}
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
                canBurn={this.state.tokensOwned.length > 0}
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
          <a href="https://opensea.io/collection/creature-game" target="_blank" rel="noopener noreferrer">
            <p>Opensea</p>
          </a>
          <a href="https://github.com/karelnagel/creature-game" target="_blank" rel="noopener noreferrer">
            <p>Github</p>
          </a>
          <a href="https://twitter.com/KarelETH" target="_blank" rel="noopener noreferrer">
            <p>Twitter</p>
          </a>
          <a href="https://polygonscan.com/address/0x3eb45bdabe55602f3eb1e71c94ec641b6fe26a3e" target="_blank" rel="noopener noreferrer">
            <p>Contract</p>
          </a>
        </footer>
      </main>
    );
  }
}

export default App;