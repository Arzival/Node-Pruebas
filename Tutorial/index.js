const {Storage} = require('@google-cloud/storage');


const fileName = 'kitten.png';
const destFileName = './kitten.png';

const storage = new Storage({
    projectId: 'pruebanode-352614',
    keyFilename: 'mykey.json',
});

const bucketName = 'contenedor-prueba';

async function getBucketMetadata() {
  const [metadata] = await storage.bucket(bucketName).getMetadata();

  console.log(metadata);
}

getBucketMetadata();