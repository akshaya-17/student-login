require('dotenv').config();
const express=require("express");
const path=require("path");
const app=express();
const hbs=require("hbs");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const cookieParser =require("cookie-parser");
const auth=require("./middleware/auth");
app.use(express.static("assets"));
const port=process.env.PORT ||3000;
require("./db/conn");
const Register=require("./models/registers");
const exp = require("constants");

const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

let logined;
//let userName;

app.get("/",(req,res)=>{
 
    res.render("index",{
        logined:false
    });
});
app.get("/index",(req,res)=>{
    res.render("index");
});
app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/login",(req,res)=>{
    res.render("login");
});



app.get("/user",auth,(req,res)=>{

   /* Register.find((err, Register)=>{
        res.render("user",{logined:true,Registers:Register});
    })
console.log(req.body.firstname);*/
imageList=[];

imageList.push({ src: "png/linkedin-ico.png" ,link:"https://www.linkedin.com/school/national-institute-of-technology-delhi/?originalSubdomain=in"});
imageList.push({ src: "png/twitter-ico.png" ,link:"https://twitter.com/NITDofficial?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor" });
imageList.push({ src: "png/yt-ico.png" ,link:"https://www.youtube.com/channel/UCw-vO6XOu6wd8U9BmoQ9ovQ"});
res.render("user",{logined:true,userName:req.user.firstname,resumelink:req.user.resumeurl,imageList: imageList});
});
app.get("/logout",auth,async(req,res)=>{
    try{
        res.clearCookie("jwt");
        console.log("logged out successfully");
        await req.user.save();
        res.render("login");
    }catch(error){
        res.status(500).send(error);
    }
});

app.post("/register",async(req,res)=>
{
try{
    const password =req.body.password;
    const cpassword=req.body.confirmpassword;
    if(password===cpassword){
        const registerEmployee=new Register({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            gender: req.body.gender,
            phone: req.body.phone,
            age: req.body.age,
            year:req.body.year,
            password:password,
            resumeurl:req.body.resumeurl,
            confirmpassword:cpassword,
        
        })
       
  

        const token=await registerEmployee.generateAuthToken();
         res.cookie("jwt",token,{
          //  expires:new Date(Date.now()+30000),
            httpOnly:true

        });


        const registered=await registerEmployee.save();
        res.status(201).render("index");
    }else{
        res.send("password is not matching");
    }
}catch(e){res.status(400).send(e);}
})

app.post("/login",async(req,res)=>{
    try{
        const email=req.body.email;
       // console.log(email);
        const password=req.body.password;
        const useremail=await Register.findOne({email});
        const isSame=await bcrypt.compare(password,useremail.password);
        const token=await useremail.generateAuthToken();
        res.cookie("jwt",token,{
           // expires:new Date(Date.now()+30000),
            httpOnly:true
            //,secure:true
         });
       //  console.log(req.cookies.jwt);


        if(isSame){
            /*const btn=document.getElementById('loginbtn');
            btn.addEventListener('click',()=>{
    btn.style.display='none';
    });*/
    
            res.status(201).render("index",{
                logined:true
            });
            
        }else{
            res.send("email/password are not matching");
        }

    }catch(e){res.status(400).send("Invalid email/password")}
})



app.listen(port,()=>{
    console.log(`connection at ${port}`);
})