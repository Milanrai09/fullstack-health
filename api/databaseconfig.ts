import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongodbConnection = async () => {
    try {
        const password = process.env.MONGODB_PASSWORD;
        const dbName = 'healthApp'; // or process.env.DB_NAME if you prefer to use an environment variable
        
        const uri = `mongodb+srv://memilanrai19:${password}@cluster1.tne8i.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster1`;
        
        await mongoose.connect(uri);
        console.log('Connected to MongoDB health database');
    } catch (error) {
        console.error('Error connecting to database:', (error as Error).message);
    }
}

export default mongodbConnection;

