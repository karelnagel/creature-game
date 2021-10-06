const { assert } = require('chai')

const CreatureToken = artifacts.require('./CreatureToken.sol')

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
      assert.equal(result, "https://game.example/api/item/{id}.json")
    })
    it('has deployer', async () => {
      result = await token.deployer()
      assert.equal(result.toString(), account.toString())
    })
  })

  describe('Mint', async () => {
    it('Mints in range', async () => {
      await token.mint(0).should.be.rejected;
      await token.mint(21).should.be.rejected;
      await token.mint(1).should.be.fulfilled;
      await token.mint(20).should.be.fulfilled;
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

      for (let i = 2; i < 20; i++) {
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
      await token.setBaseUri("asd")
      result = await token.uri(0)
      assert.equal(result.toString(), 'asd')
    })
  })
})
