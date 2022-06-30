const { Storage } = require('@google-cloud/storage');
const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const archiver = require('archiver');

function initBigQuery() {
  const bigQuery = new BigQuery({
    projectId: 'pruebanode-352614',
    keyFilename: 'mykey.json'
  });
  return bigQuery;
}
//Cambio desde mi rama para test de merge
function initStorage() {
  const storage = new Storage({
    projectId: 'pruebanode-352614',
    keyFilename: 'mykey.json'
  });
  return storage;
}
//este cambio es de mi prueba
//cambio 2
//cambio desde master
// export default {
//   getData: async (req, res) => {
//     try {
//       const bigQuery = initBigQuery();
//       const query = `SELECT * FROM pruebanode-352614.prueba_datos.datos LIMIT 1000`;
//       //consulta a BigQuery la informacion de la tabla debe ir entre backticks
//       const options = {
//         query: query,
//         location: 'US',
//       };
//       const [job] = await bigQuery.createQueryJob(options);
//       const [rows] = await job.getQueryResults();
//       res.status(200).json(new Response({ result: true, data: rows }))
//     } catch (error) {
//       console.log(error)
//       res.status(error.code || 500).json(new Response({ result: false, message: 'Error con Google BigQuery', data: error.message }))
//       return
//     }
//   },
//   getBucktData: async (req, res) => {
//     try {
//       // inicializar instancia de Storage
//       const storage = initStorage();
//       // nombre del contenedor al que nos vamos a conectar
//       const bucketName = 'contenedor-prueba';
//       // Metadatos del contenedor para probar que tenemos conexion
//       const [metadata] = await storage.bucket(bucketName).getMetadata();
//       res.json(new Response({ result: true, data: metadata }))
//     } catch (error) {
//       console.log(error)
//       res.status(error.code || 500).json(new Response({ result: false, message: 'Error con Google Storage', data: error.message }))
//       return
//     }
//   }
// }
async function getBucktData() {
  // inicializar instancia de Storage
  const storage = initStorage();
  // nombre del contenedor al que nos vamos a conectar
  const bucketName = 'contenedor-prueba';
  const listFilesName = [];
  const options = {
    prefix: '10/fiscal/',
  };
  const [files] = await storage.bucket(bucketName).getFiles(options);
  console.log('Files:');
  files.forEach(file => {
    listFilesName.push(file.name)
  });

  const total = listFilesName.length;
  for (let i = 1; i < total; i++) {
    const filname = `${listFilesName[i]}`;
    const name = filname.split('/')[2];
    const fReferencia = listFilesName[i].split('/')[0];
    const fCarpeta = listFilesName[i].split('/')[1];
    const path = `./${fReferencia}/${fCarpeta}`;

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    const options = {
      destination: `./${path}/${name}`,
    };
    await storage.bucket(bucketName).file(filname).download(options);
    console.log(listFilesName[i].split('/')[2]);
  }

  // const output = fs.createWriteStream('./ref.zip');
  // const archive = archiver('zip', {
  //   zlib: { level: 9 }
  // });

  // output.on('close', function () {
  //   console.log(archive.pointer() + ' total bytes');
  //   console.log('archiver has been finalized and the output file descriptor has closed.');
  //   try {
  //     for (let i = 1; i < total; i++) {
  //       fs.unlinkSync(`./files/${listFilesName[i].split('/')[2]}`);
  //     }
  //     console.log('File removed')
  //   } catch (err) {
  //     console.error('Something wrong happened removing the file', err)
  //   }
  // });

  // archive.on('error', function (err) {
  //   throw err;
  // });
  // archive.pipe(output);
  // archive.directory('./files', true, { date: new Date() });
  // archive.finalize();

}
getBucktData();