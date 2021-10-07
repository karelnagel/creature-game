//node src/components/ToJson.js
const fs = require('fs');

let handles = ['afternoon_mate', 'bendetta666', 'crammereth', 'Damatosonian', 'Frankdebru', 'Greentoe_eth','jbe61','meangirl_eth','melissa_nft','RyanLeu89436753','Surfdomchaser']
let baseUrl = 'https://creature-4c69f.web.app/'
let counter = 1

function writeObject(object, file) {
    let data = JSON.stringify(object);
    fs.writeFileSync(`public/json/${file}.json`, data);
}

//Write all NFTs 
handles.forEach((handle) => {
    let object = {
        name: handle,
        description: `Go follow http://twitter.com/${handle}`,
        image: `${baseUrl}images/${handle}.jpg`,
        external_url: baseUrl
    }
    writeObject(object, counter)
    counter++;
})
console.log(handles.length)

//Write special NFT
let special = {
    name: 'Special NFT',
    description: 'This is the one you want to hold',
    image: `${baseUrl}images/0.jpg`,
    external_url: baseUrl
}
writeObject(special, '0')

//Write collection
let contract = {
    name: 'Creature game',
    description: `Find all creatures to get one special token.\nMade by http://twitter.com/KarelETH \nGo play ${baseUrl}`,
    external_link: baseUrl,
    image: `${baseUrl}images/collection.jpg`,
    seller_fee_basis_points: 7500,
    fee_recipient: '0x3A823E158083e186ECfD61370d1a62D6C02F8D21'
}
writeObject(contract, 'contract')