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
  // arreglo donde van a ir los archivos
  const listFilesName = [];
  // Carpeta donde se encuentran los archivos la ruta debe ser exacta para que no tarde en encontrarlos
  const options = {
    prefix: '10/fiscal/',
  };
  // Obtenemos el listado de archivos
  const [files] = await storage.bucket(bucketName).getFiles(options);
  console.log('Files:');
  // Recorremos el listado de archivos para obtener el nombre y la ruta
  files.forEach(file => {
    listFilesName.push(file.name)
  });
  // contamos el numero de archivos, no es necasario crear una constante pero es una buena practica
  const total = listFilesName.length;
  //hacemos un ciclo donde el tope es el total de nuestros archivos, para iniciar el proceso de descarga
  for (let i = 1; i < total; i++) {
    // la constante date nos ayudara para que cada archivo tenga un nombre diferente
    const date = new Date();
    // la ruta donde se va a guardar el archivo, la carpeta temporal debe de estar creada con anticipacion
    let path = `./temporales/${listFilesName[i].split('/')[0]}`;
    // creamos la carpeta si no existe, en este caso la primera carpeta creada es la referencia
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    //la siguiente carpeta que se debe crear es la de fiscal, aqui es en donde se guardara una parte de nuestros archivos
    path = `./temporales/${listFilesName[i].split('/')[0]}/${listFilesName[i].split('/')[1]}`;
    // creamos la carpeta si no existe, el sistema de creacion de carpetas depende mucho de como esten guardados los archivos en Storage
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    // pasamos la ruta y el nombre con el que se guardara el archivo
    const options = {
      destination: `./${path}/${listFilesName[i].split('/')[2]}`,
    };
    await storage.bucket(bucketName).file(listFilesName[i]).download(options);
    // console.log(listFilesName[i].split('/')[2]);
  }
  // creamos el archivo zip con un nivel de compresion de 9
  const output = fs.createWriteStream('./ref.zip');
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });
  // en cuanto se crea el archivo zip, se ejecuta el siguiente codigo que va a eliminar los archivos descargados para no tener alamacenado mas de lo que se necesita
  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
    try {
      for (let i = 1; i < total; i++) {
        fs.unlinkSync(`./files/${listFilesName[i].split('/')[2]}`);
      }
      console.log('File removed')
    } catch (err) {
      console.error('Something wrong happened removing the file', err)
    }
  });

  archive.on('error', function (err) {
    throw err;
  });
  archive.pipe(output);
  archive.directory('./files', true, { date: new Date() });
  archive.finalize();

}
getBucktData();