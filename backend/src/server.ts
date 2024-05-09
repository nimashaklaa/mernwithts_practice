import "dotenv/config";
import mongoose from "mongoose";
import env from "./util/validateEnv"
import app from "./app"



const port = env.PORT;
mongoose.connect(env.MONGODB_URL)
    .then(()=>{
        console.log("Mongoose connected")
        app.listen(port,()=>{
            console.log(`Server running on port ${port}`)
        })
    }).catch(console.error)
