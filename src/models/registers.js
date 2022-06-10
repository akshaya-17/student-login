require('dotenv').config();
const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const employeeSchema=new mongoose.Schema({
    firstname : {
        type: String,
        required : true
    },
    lastname : {
        type: String,
        required : true
    },
    email : {
        type: String,
        required : true,
        unique : true
    },
    phone : {
        type: Number,
        required : true,
        unique: true
    },
    age : {
        type: Number,
        required : true
    },
    password : {
        type: String,
        required : true
    },
    year : {
        type: Number,
        
    },
    resumeurl : {

        type:String,
    },
    confirmpassword : {
        type: String,
        required : true
    },
    
    tokens :[{
        token:{
            type:String,
            required:true
        }
    }]
})

employeeSchema.methods.generateAuthToken=async function(){

    try{
        const token=jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(error){
        res.send(error);
        console.log(error);
    }
}


employeeSchema.pre("save",async function(next){
   if(this.isModified("password")){
    this.password=await bcrypt.hash(this.password,10);
    this.confirmpassword=await bcrypt.hash(this.password,10);
   }
next();

})

const Register = new mongoose.model("Register",employeeSchema);
module.exports=Register;