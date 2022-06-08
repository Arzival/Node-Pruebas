import {getConnection} from '../database/database';

const getLenguage = async (req, res) => {
try {
    const connection = await getConnection();
    const result = await connection.query('SELECT * FROM lenguajes');
    console.log(result);
    res.json(result);
} catch (error) {
    console.error(error);
    res.json({
        message: 'Error al obtener los lenguajes',
        error,
    }).status(500);
}
};

const createLenguage = async (req, res) => {
    try {
        const connection = await getConnection();
        const {name, programmers} = req.body;
        const result = await connection.query('INSERT INTO lenguajes SET ?', {name, programmers});
        console.log(result);
        res.json({
            message: 'Lenguaje creado',
            result,
        });
    } catch (error) {
        console.error(error);
        res.json({
            message: 'Error al crear el lenguaje',
            error,
        }).status(500);
    }
};

const updateLenguage = async (req, res) => {
    try {
        const connection = await getConnection();
        const {name, programmers} = req.body;
        const result = await connection.query('UPDATE lenguajes SET ? WHERE id = ?', [{name, programmers}, req.params.id]);
        console.log(result);
        res.json({
            message: 'Lenguaje actualizado',
            result,
        });
    } catch (error) {
        console.error(error);
        res.json({
            message: 'Error al actualizar el lenguaje',
            error,
        }).status(500);
    }
};


export const methods = {
    getLenguage,
    createLenguage,
    updateLenguage
};