import mongoose from "mongoose";

const connectDb = async () => {
    
       return mongoose.connect(process.env.MONGO_URI)
}

export default connectDb;