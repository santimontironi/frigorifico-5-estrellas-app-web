import app from './app.js'
import {connectDB} from './config/db.config.js'

export const startServer = async () => {
    try{
        await connectDB();
        app.listen(process.env.PORT, () => {
            console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
        });
    }
    catch(error){
        console.error('Error al conectar a la base de datos', error);
    }
}