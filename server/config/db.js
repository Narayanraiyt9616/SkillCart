import mongoose from 'mongoose';

const ATLAS_URI = 'mongodb://rainarayan709_db_user:Lw3q98VG20tjvwop@ac-oqmjv60-shard-00-00.vktecko.mongodb.net:27017,ac-oqmjv60-shard-00-01.vktecko.mongodb.net:27017,ac-oqmjv60-shard-00-02.vktecko.mongodb.net:27017/skillcert?ssl=true&replicaSet=atlas-gfed1v-shard-0&authSource=admin&retryWrites=true&w=majority';

export const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI?.trim();
  const uriToTry = primaryUri || ATLAS_URI;

  try {
    const conn = await mongoose.connect(uriToTry, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    // If local or configured URI failed and is not Atlas, automatically fall back to cloud Atlas
    if (uriToTry !== ATLAS_URI) {
      console.warn(`[MongoDB Warning] Primary connection failed (${error.message}). Switching to MongoDB Atlas...`);
      try {
        const fallbackConn = await mongoose.connect(ATLAS_URI, {
          serverSelectionTimeoutMS: 8000,
        });
        console.log(`[MongoDB] Connected to Atlas: ${fallbackConn.connection.host}`);
        return true;
      } catch (atlasErr) {
        console.error(`[MongoDB Error] Could not connect to Atlas fallback: ${atlasErr.message}`);
      }
    } else {
      console.error(`[MongoDB Error] Could not connect to MongoDB: ${error.message}`);
    }
    return false;
  }
};
