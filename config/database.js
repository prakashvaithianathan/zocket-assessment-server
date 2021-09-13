const mysql = require('mysql');

const connection = mysql.createConnection({
    host:process.env.MY_SQL_HOST,
    user:process.env.MY_SQL_USER,
    password:process.env.MY_SQL_PASSWORD,
    database:process.env.MY_SQL_DATABASE
})





const mySql = async()=>{
    try {
       connection.connect((err)=>{
           if(err){throw err}
           else{
               console.log('Database connected');
           }
       })
        
    } catch (error) {
        console.log('error in connect in database');
    }


    
}

module.exports = {mySql,connection}