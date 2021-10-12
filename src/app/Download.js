//node src/app/ToJson.js
var wget = require('wget');

var creatures=[['asdasd',0],['asdasd',1]]

creatures.forEach((creature)=>{
    let name = creature[0]
    let id=creature[1]
    var download = wget.download('https://gateway.pinata.cloud/ipfs/QmZHirXLstiWa483g6Ni9JVZKgpWJEr31mYC7UWzPUNDMm/'+id+'.jpg', `public/images/${name}.jpg`);
})
