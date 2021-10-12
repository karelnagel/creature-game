//node src/app/Download.js
var wget = require('wget');
const fs = require('fs')

var creatures = [
    ['idlebit', 7368], ['s17a_xyz', 8461], ['bendetta666', 5651], ['Damatosonian', 3885], ['Jappaofficial4', 7928], ['xohiebeexc', 8782], ['PRAM0D_NAUTIYAL', 8179], ['AstrocatNFTs', 2995], ['Luca_Capo96', 9073], ['jbe61', 5983], ['vnctbm', 4193], ['mikejp__', 8282], ['YcryptoKa', 8208], ['alderaanshot1st', 2341], ['cookiesfortune_', 9341], ['ididitinshorts', 6543], ['Alpurrt', 556], ['CryptOffChillen', 5783], ['LemonGft', 7618], ['POLLYN_ind', 7337], ['Willdem808', 6709], ['creature_cmfrt', 4393], ['eelcryptoe', 5725], ['Or_NFT07', 9956], ['ElFuser11', 5255], ['luvisnft', 5221], ['DMC_Yi', 5546], ['rudestamp', 2122], ['pinco0521', 6471], ['onionsforthree', 1773], ['kuru_pira', 2751], ['VDyl87', 5512], ['Smashe__', 2502], ['Frankdebru', 9548], ['GOATY78501212', 7342], ['anima_eth', 204], ['BadBeaverCo', 7701], ['FPLAdmiral', 6916], ['RemixMTG', 2255], ['jp12method', 4008], ['TheDavidMurray', 6140], ['dijosong', 123], ['melissa_nft', 4742], ['Manos_Diamante', 4042],
    ['Pgigi94', 8375], ['meangirl_eth', 2356],
    ['BdelloidRotifer', 4358],
    ['SecretariYat', 96],
    ['nft_josh', 7169],
    ['kzolson19', 2003],
    ['Demon_mom666', 9644],
    ['jrcashhh', 8761],
    ['dripgtbz', 7926],
    ['NickSni43144906', 258],
    ['WATERxBEAR', 9181],
    ['NN_NFT', 9703],
    ['bambo823', 8140],
    ['SmallDickHero', 4523],
    ['JGtaxCPA', 9],
    ['BullishCat_', 2438],
    ['Crypt_O_Manimal', 8178],
    ['Creature_3241', 3241],
    ['kevincreatures', 942],
    ['Key_Yeti', 2325],
    ['CryptoAnonymou7', 1667],
    ['brarjaskaran', 1726],
    ['kendude_', 357],
    ['BigBawlaBoi', 1332],
    ['theboyalu', 2672],


    ['EmilianoConti1', 714],
    ['GCButcher42', 8805],
    ['Jan_Hodls', 3413],
    ['swhoo_eth', 8597],
    ['pudgycreature', 4230],
    ['DigitalCardC', 3380],
    ['KCgillN', 3724],
    ['ekko1_', 6194],
    ['herd_ewe', 3004],
    ['nmbr2dad', 3148],
    ['karelETH', 2258],
    ['dannycoleee', 8831],
    ['SHAQ', 9018],
    ['PhatStraws', 6531],
    ['KidHastings', 4392],
    ['remixrfi', 9667],
]
let namesArray = creatures.map((creature) => creature[0])
console.log(namesArray)
function eliminateDuplicates(arr) {
    var i,
        len = arr.length,
        out = [],
        obj = {};
  
    for (i = 0; i < len; i++) {
      obj[arr[i]] = 0;
    }
    for (i in obj) {
      out.push(i);
    }
    return out;
  }
  
  console.log(eliminateDuplicates(namesArray))
creatures.forEach((creature, i) => {
    console.log(i)
    let name = creature[0]
    let id = creature[1]
    let path = `public/images/${name}.jpg`

    if (!fs.existsSync(path)) {
        let download = wget.download('https://gateway.pinata.cloud/ipfs/QmZHirXLstiWa483g6Ni9JVZKgpWJEr31mYC7UWzPUNDMm/' + id + '.jpg', path);
        download.on('error', function (err) {
            console.log(err);
        });
        download.on('end', function (output) {
            console.log(output);
        });
        download.on('progress', function (progress) {
            console.log(progress);
        });
    }
})
