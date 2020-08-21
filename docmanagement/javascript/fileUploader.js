'use strict'

const IPFS = require('ipfs')
const all = require('it-all')
var fs = require('fs');

async function uploadfile () {
    let filec;
fs.readFile('hello.txt', 'utf8', function(err, data) {
    if (err) throw err;
    filec = data;
});
  const node = await IPFS.create()
  const version = await node.version()

  console.log('Version:', version.version)

  const file = await node.add({
    path: 'hello.txt',
    content: Buffer.from(filec)
  })

  //get CID  and succesful upload
  console.log('Added file:', file.path, file.cid.toString())

  //read content
  const data = Buffer.concat(await all(node.cat(file.cid)))

  console.log('Added file contents:', data.toString())
  return file.cid;
}

//main()

var upoload = async function(fucname, docnumber) {
    try {
        // load the network configuration
        return uploadfile();


    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }

}
exports.fileUploader = upoload;

