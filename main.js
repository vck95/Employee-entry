const express = require('express');
const mysql = require('mysql2');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

// app.use(bodyparser.json());
// app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.urlencoded({extended:false}));
app.use(express.json())


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"",
    database: "test"
});

db.connect((err,result) => {
    if(err){
        console.log("error",err);
    }
    else{
        console.log("server connected");
    }
});

app.post("/api/employeeAdd",ensureToken,(req,res)=>{
    console.log(req.body);

    const SQL = `INSERT INTO employees(firstName,lastName,designation,salary,dob,createdAt,updatedAt)
    VALUES('${req.body.firstName}','${req.body.lastName}','${req.body.designation}', '${req.body.salary}', '${req.body.dob}', '${req.body.createdAt}', '${req.body.updatedAt}')`;
        console.log(SQL);

 db.query(SQL, (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
       return res.send('User registered');
    }
})

});

//Add employee
app.post("/api/employeeAdd2-",(req,res)=>{
    console.log(req.body);
    return res.send("testing");
});
app.post("/api/employeeAdd-",ensureToken, (req,res) => {
    console.log(req.body);
    //jwt
    // jwt.verify(req.token, 'my_secret-key', (err, data) =>{
    //     if(err){
    //     res.sendStatus(403);
    //     }
    //     else{
    //         res.json({
    //             text:"this is protected",
    //         data:data
    //         })
            
    //     }
    //             })
    
    
    //to insert
    const SQL = `INSERT INTO employees(firstName,lastName,designation,salary,dob,createdAt,updatedAt)
    VALUES('${req.body.firstName}','${req.body.lastName}','${req.body.designation}', '${req.body.salary}', '${req.body.dob}', '${req.body.createdAt}', '${req.body.updatedAt}')`;
        console.log(SQL);

 db.query(SQL, (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        res.send('User registered');
    }
})
});

//Edit employee
app.put("/api/employeeUpdate/:id",(req,res)=>{
    // console.log(req.params.id);
    const USQL = `UPDATE employees SET
    firstName='${req.body.firstName}',lastName='${req.body.lastName}',designation='${req.body.designation}',
    salary='${req.body.salary}',dob='${req.body.dob}',createdAt='${req.body.createdAt}',updatedAt='${req.body.updatedAt}' WHERE id='${req.body.id}'`;
 
     db.query(USQL,(err,result)=>{
      if (err) {
          throw err
      }
      res.send("User Updated");
     })
});

//Edit employee
    app.get('/api/employeeEdit/:id',(req,res)=>{
     const ESQL = `SELECT * FROM employees WHERE id="${req.params.id}"`;
      db.query(ESQL,(err,result)=>{
           if (err) {
             throw err
           }
           res.send(result)
         })
     });

//Delete employee
app.delete("/api/employeeDelete/:id", (req,res) => {
    db.query('DELETE FROM employees WHERE id = ?',[req.params.id],(err,result) =>{
        if(!err){
            res.json("Deleted"); 
        }
        else{
            console.log(err);
        }
    });
    });



app.post("/api/login",(req,res)=>{
    console.log(req.body);
    const user = {id:3};
   const token = jwt.sign({user}, 'my_secret_key');
   res.json({msg: token});
});

    app.post("/api/protected",ensureToken, (req, res) => {
        jwt.verify(req.token,'my_secret_key',(err,authData)=>{
            if (err) {
                res.sendStatus(403)
            }else{
                res.json({
                    message:"Welcom to API...!",
                    authData
                });
            }
        })
    });


    function ensureToken(req,res,next) {
        const bareerheader = req.headers['authorization'];
        if (typeof bareerheader !== 'undefined') {
            const bearer = bareerheader.split(' ');
            const bearerToken = bearer[1];
            console.log(bearerToken);

            jwt.verify(bearerToken,"my_secret_key",(err,result)=>{
              if (err) {
                return res.status(500).json({msg:"Invalid Token",status:0})
              }else{
                console.log(result);
              }
            })

            req.token= bearerToken;
            next();
        } else {
          return  res.sendStatus(403);
        }
    }

app.listen("3001",()=>{
    console.log("3001");
    console.log("data is connected");
});
