import mongoose from "mongoose";

mongoose.connect("mongodb+srv://kateandrade2009:kathe220402@cluster0.efptg.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conectados a la BD"))
    .catch( (error) => console.log("Tenemos un error ", error ))