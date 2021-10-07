import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import CreatureToken from '../abis/CreatureToken.json'
import brain from '../brain.png'
import axios from 'axios';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    if (!this.state.finished) await this.getRandomToken()
    this.setState({ loading: false })
  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const [account] = await web3.eth.getAccounts()
    this.setState({ account })

    // Load smart contract
    const networkId = await web3.eth.net.getId()
    const networkData = CreatureToken.networks[networkId]
    if (networkData) {
      const abi = CreatureToken.abi
      const address = networkData.address
      const token = new web3.eth.Contract(abi, address)
      this.setState({ token })
      const maxBalance = await token.methods.maxBalance().call()
      this.setState({ maxBalance })

      let tokensOwned = []
      let tokens = []
      for (let i = 1; i <= maxBalance; i++) {
        //Read all tokens from json
        let response = await axios.get(`json/${i}.json`)
        tokens.push({ id: i.toString(), name: response.data.name, image: response.data.image })
        //Check if user owns
        let result = await token.methods.balanceOf(account, i).call()
        if (result.toString() === '1') {
          tokensOwned.push(i.toString())
        }
      }
      let finalToken = await token.methods.balanceOf(account, 0).call()


      //Getting reviews
      let reviews = [];
      let reviewCount = await token.methods.reviewCount().call()
      for (let i = 0; i < reviewCount; i++) {
        let review = await token.methods.reviews(i).call()
        reviews.push(review)
      }
      console.log(reviews)

      let canReview = !await token.methods.userLeftReview(account).call()
      console.log(canReview)

      this.setState({ tokensOwned, tokens, reviews, canReview })
      if (finalToken.toString() === '1')
        this.setState({ finished: true })

    } else {
      alert('Smart contract not deployed to detected network.')
    }
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
    console.log(this.state.tokensOwned)
    let notFoundTokens = []
    this.state.tokens.forEach(element => {
      if (!this.state.tokensOwned.includes(element.id))
        notFoundTokens.push(element)
    });
    console.log(this.state.tokensOwned)
    console.log(notFoundTokens)
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

    //Act
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
      token: null,
      maxBalance: 0,
      tokensOwned: [],
      tokens: [],
      currentToken: {},
      currentPictures: {},
      reviews: [],
      canReview: true,
      reviewText: ''
    }
  }
  render() {
    if (this.state.loading) return (<div></div>);
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <img src={brain} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; Creature Tokens
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-muted"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1 className="d-4">Start matching now!</h1>
                {!this.state.finished
                  ?
                  <div id='game'>
                    <a href={`https://twitter.com/${this.state.currentToken.name}`}>
                      <p>{this.state.currentToken.name}</p>
                    </a>

                    <div>
                      {this.state.currentPictures.map((picture) => {
                        return (<img width='100' src={picture.image} alt='' onClick={() => this.select(picture.id)} />)
                      })}
                    </div>

                  </div>
                  :
                  <div id="finished">
                    <h3>Congratulations you finished the game!</h3>
                    {
                      this.state.canReview ?
                        <form>
                          <input type="text" value={this.state.searchQuery} onChange={this.handleInputChanged.bind(this)} />
                          <button onClick={this.leaveReview.bind(this)}>
                            Submit
                          </button>
                        </form>
                        :
                        <div></div>
                    }
                    {this.state.tokensOwned.length > 0 ? <button onClick={this.burn.bind(this)}>Burn</button> : <div></div>}
                  </div>}
                <div id="collected">
                  <h5>Tokens Collected:<span id="result">&nbsp;{this.state.tokensOwned.length} / {this.state.maxBalance.toString()}</span></h5>
                  <div className="grid mb-4" >
                    {this.state.tokensOwned.map((key) => {
                      let info = this.state.tokens.find((token) => token.id === key)
                      return (
                        <a href={`https://twitter.com/${info.name}`}>
                          <img
                            width="50"
                            alt=''
                            key={key}
                            src={info.image}
                          />
                          <p>{info.name}</p>
                        </a>
                      )
                    })}
                  </div>
                </div>
                <div id="reviews">
                  {this.state.reviews.map((review) => {
                    return (<p>{review}</p>)
                  })}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;