const { assert } = require('chai')

const CreatureToken = artifacts.require('./CreatureToken.sol')
const shouldBeMax = 11
require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Creature Token', ([account, investor]) => {
  let token
  let address
  let result
  before(async () => {
    token = await CreatureToken.deployed()
    address = token.address
  })

  describe('Deployment', async () => {
    it('deploys successfully', async () => {
      assert.notEqual(address, '0x0')
      assert.notEqual(address, '')
      assert.notEqual(address, undefined)
      assert.notEqual(address, null)
    })

    it('has uri', async () => {
      result = await token.uri(0)
      assert.equal(result, "https://creature-4c69f.web.app/json/{id}.json")
    })
    it('has contract uri', async () => {
      result = await token.contractURI()
      assert.equal(result, "https://creature-4c69f.web.app/json/contract.json")
    })
    it('has deployer', async () => {
      result = await token.deployer()
      assert.equal(result.toString(), account.toString())
    })
  })

  describe('Mint', async () => {
    it('Mints in range', async () => {
      await token.mint(0).should.be.rejected;
      await token.mint(shouldBeMax+1).should.be.rejected;
      await token.mint(1).should.be.fulfilled;
      await token.mint(shouldBeMax).should.be.fulfilled;
    })

    it('One per user', async () => {
      await token.mint(1).should.be.rejected
    })
    it('UserBalance works', async () => {
      result = await token.userBalance(account)
      assert.equal(result.toString(), '2')
    })
    it('When all tokens are collected user gets extra token', async () => {
      result = await token.balanceOf(account, 0)
      assert.equal(result.toString(), '0')

      for (let i = 2; i < shouldBeMax; i++) {
        await token.mint(i).should.be.fulfilled
      }

      result = await token.balanceOf(account, 0)
      assert.equal(result.toString(), '1')
    })
  })

  describe('Deployer functions', async () => {

    it('Change max balance ', async () => {
      await token.setMaxBalance(69, { from: investor }).should.be.rejected
      await token.setMaxBalance(77)
      result = await token.maxBalance()
      assert.equal(result.toString(), '77')
    })


    it('Change base uri ', async () => {
      await token.setBaseUri("asdfasdfasdfasdf", { from: investor }).should.be.rejected
      await token.setBaseUri("http://localhost:3000/json/")
      result = await token.uri(0)
      assert.equal(result.toString(), 'http://localhost:3000/json/')
    })

    it('Change collection uri ', async () => {
      await token.setContractUri("asdfasdfasdfasdf", { from: investor }).should.be.rejected
      await token.setContractUri("http://localhost:3000/json/")
      result = await token.contractURI()
      assert.equal(result.toString(), 'http://localhost:3000/json/')
    })
    it('Change active status ', async () => {
      await token.setActiveStatus(false, { from: investor }).should.be.rejected
      await token.setActiveStatus(false)
      result = await token.active()
      assert.equal(result.toString(), 'false')
    })
  })

  describe('Leave review', async () => {

    it('review ', async () => {
      await token.leaveReview("asdasd", { from: investor }).should.be.rejected
      await token.leaveReview("Hello").should.be.fulfilled

      await token.leaveReview("Helloasdf").should.be.rejected

      result = await token.reviews(0)
      assert.equal(result.toString(), "Hello")

      result = await token.reviewCount()
      assert.equal(result.toString(), '1')
    })
  })

  describe('Burn tokens', async () => {

    it('burn ', async () => {
      let maxBalance = await token.maxBalance()
      let ids=[]
      let values=[]
      for (let i = 1; i <= maxBalance; i++) {
       let balance = await token.balanceOf(account, i)
       if (balance >0){
         ids.push(i)
         values.push(balance)
       }
      }

      //Act
      await token.burnBatch(account,ids,values,{from:account})

      //Assert
      for (let i = 1; i <= maxBalance+1; i++) {
        result = await token.balanceOf(account, i)
        assert.equal(result.toString(), '0')
      }
      result = await token.balanceOf(account, 0)
      assert.equal(result.toString(), '1')
    })
  })

})
