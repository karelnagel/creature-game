const { assert } = require('chai')

const CreatureToken = artifacts.require('./CreatureToken.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Creature Token', ([account]) => {
  let token
  let address
  before(async () => {
    token = await CreatureToken.deployed()
    address = token.address
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      assert.notEqual(address, '0x0')
      assert.notEqual(address, '')
      assert.notEqual(address, undefined)
      assert.notEqual(address, null)
    })

    it('has a name and symbol', async () => {
      const name = await token.name()
      assert.equal(name, 'Creature Token')
      const symbol = await token.symbol()
      assert.equal(symbol, 'CREATURE')
    })
  })

  describe('Token distribution', async () => {
    let result;
    it('mints tokens', async () => {
      await token.mint(account, "asdasdfadsf")

      result = await token.totalSupply()
      assert.equal(result, '1', 'total supply one')

      result = await token.balanceOf(account)
      assert.equal(result.toString(), '1')

      result = await token.ownerOf('1')
      assert.equal(result.toString(), account.toString())
      result = await token.tokenOfOwnerByIndex(account, 0)

      let balanceOf = await token.balanceOf(account)
      let tokenIds=[]
      for (let i =0;i<balanceOf;i++){
        let id = await token.tokenOfOwnerByIndex(account,i)
        tokenIds.push(id.toString())
      }
      let expected = ['1']
      assert.equal(tokenIds.toString(),expected.toString())

      let tokenURI = await token.tokenURI('1')
      assert.equal(tokenURI,'asdasdfadsf')

    })
  })
})
