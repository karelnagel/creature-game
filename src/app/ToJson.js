//node src/app/ToJson.js
const fs = require('fs');

let handles = [
    'idlebit',         's17a_xyz',        'bendetta666',     'Damatosonian',
    'Jappaofficial4',  'xohiebeexc',      'PRAM0D_NAUTIYAL', 'AstrocatNFTs',
    'Luca_Capo96',     'jbe61',           'vnctbm',          'mikejp__',
    'YcryptoKa',       'alderaanshot1st', 'cookiesfortune_', 'ididitinshorts',
    'Alpurrt',         'CryptOffChillen', 'LemonGft',        'POLLYN_ind',
    'Willdem808',      'creature_cmfrt',  'eelcryptoe',      'Or_NFT07',
    'ElFuser11',       'luvisnft',        'DMC_Yi',          'rudestamp',
    'pinco0521',       'onionsforthree',  'kuru_pira',       'VDyl87',
    'Smashe__',        'Frankdebru',      'GOATY78501212',   'anima_eth',
    'BadBeaverCo',     'FPLAdmiral',      'RemixMTG',        'jp12method',
    'TheDavidMurray',  'dijosong',        'melissa_nft',     'Manos_Diamante',
    'Pgigi94',         'meangirl_eth',    'BdelloidRotifer', 'SecretariYat',
    'nft_josh',        'kzolson19',       'Demon_mom666',    'jrcashhh',
    'dripgtbz',        'NickSni43144906', 'WATERxBEAR',      'NN_NFT',
    'bambo823',        'SmallDickHero',   'JGtaxCPA',        'BullishCat_',
    'Crypt_O_Manimal', 'Creature_3241',   'kevincreatures',  'Key_Yeti',
    'CryptoAnonymou7', 'brarjaskaran',    'kendude_',        'BigBawlaBoi',
    'theboyalu',       'EmilianoConti1',  'GCButcher42',     'Jan_Hodls',
    'swhoo_eth',       'pudgycreature',   'DigitalCardC',    'KCgillN',
    'ekko1_',          'herd_ewe',        'nmbr2dad',        'karelETH',
    'dannycoleee',     'SHAQ',            'PhatStraws',      'KidHastings',
    'remixrfi'
  ]



let baseUrl = 'https://creature-game.web.app/'
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
console.log(counter-1)

//Write special NFT
let special = {
    name: 'Special NFT',
    description: 'This is the one you want to hold',
    image: `${baseUrl}images/0.jpg`,
    external_url: baseUrl
}
writeObject(special, '0')

//Write contract
let contract = {
    name: 'Creature game',
    description: `Find all creatures to get one special token.\nMade by http://twitter.com/KarelETH \nGo play ${baseUrl}`,
    external_link: baseUrl,
    image: `${baseUrl}images/0.jpg`,
    banner_image: `${baseUrl}images/contract_banner.jpg`,
    banner: `${baseUrl}images/contract_banner.jpg`,
    seller_fee_basis_points: 7500,
    fee_recipient: '0x3A823E158083e186ECfD61370d1a62D6C02F8D21'
}
writeObject(contract, 'contract')