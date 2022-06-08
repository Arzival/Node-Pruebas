const {Storage} = require('@google-cloud/storage');


const fileName = 'kitten.png';
const destFileName = './kitten.png';

const storage = new Storage({
    projectId: 'pruebanode-352614',
    keyFilename: 'mykey.json',
});

const bucketName = 'contenedor-prueba';

async function downloadFile() {
    const options = {
      destination: destFileName,
    };
  
    // Downloads the file
    await storage.bucket(bucketName).file(fileName).download(options);
  
    console.log(
      `gs://${bucketName}/${fileName} downloaded to ${destFileName}.`
    );
  }
  
  downloadFile().catch(console.error);