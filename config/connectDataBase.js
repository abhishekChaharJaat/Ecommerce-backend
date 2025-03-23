import mongoose from "mongoose";

const connectDataBase = async () => {
    try {
         await mongoose.connect(process.env.MONGO_URL)
         console.log("Connect to mongo successfull");
    }
    catch(error) {
           console.log("Failed to connect Database")
    }
}

export default connectDataBase;