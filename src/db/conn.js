const mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/students-reg",{
    useNewurlParser:true,
    useUnifiedTopology:true,
   
}).then(()=>{
    console.log("connection established");
}).catch((err)=>{
    console.log(err);
})
