const { Storage } = require('@google-cloud/storage');
const { BigQuery } = require('@google-cloud/bigquery');

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
    // Metadatos del contenedor para probar que tenemos conexion
    const listFilesName = [];
    const options = {
      prefix: '10',
    };
    const listFilesName11 = [];
    const options11 = {
      prefix: '11',
    };
    const [files11] = await storage.bucket(bucketName).getFiles(options11);
    const [files] = await storage.bucket(bucketName).getFiles(options);
    console.log('Files:');
    files.forEach(file => {
          listFilesName.push(file.name)
    });
    filles11.forEach(file => {
          listFilesName11.push(file.name)
    });
    console.log(listFilesName);
}
getBucktData();