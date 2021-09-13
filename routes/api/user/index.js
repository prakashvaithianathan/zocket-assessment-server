const router = require("express").Router();
const { connection } = require("../../../config/database");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const sender = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
});

router.get("/", (req, res) => {
  res.send("This is user route");
});

router.post("/add", async (req, res) => {
  try {
    const date = new Date().getTime();

    const value = `insert into users (user_email,user_registered,date,user_phone) values('${req.body.email}',false,${date},${date})`;

    connection.query(value, function (err, data) {
      if (err) {
        res.send("error" + err);
      } else {
        const token = jwt.sign(
          { userId: data.insertId },
          process.env.SECRET_KEY
        );
        const composeMail = {
          from: process.env.EMAIL,
          to: req.body.email,
          subject: "Mail from Zocket",
          html: `
                  <div>
                  <p><b>Hi, This is Prakash from Zocket.
                  </b>. We welcome to our platform</p>
                  <p>To register the form, click below</p>
                  <a href="localhost:3000/verify/${token}">
                  <button  style="padding:10px 20px;background-color:blue;color:white;border:none;outline:none;border-radius:10px">
                    Click Here
                  </button>
                  </a>
                  </div>
                  `,
        };
        sender.sendMail(composeMail, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log("mail sended successfully" + data.response);
          }
        });
        res.send(data);
      }
    });

    // res.send(user);
  } catch (error) {
    res.send(error.message);
  }
});

// router.get("/get", async (req, res) => {
//   const token = req.headers["authorization"];

//   const data = await jwt.verify(token, process.env.SECRET_KEY);

//   const user = `select * from users where user_id=${data.userId}`;
//   connection.query(
//    user,
//   function (err, data) {
//     if (err) {
//       return res.json("error" + err);
//     } else {

//       res.json(data);
//     }})

// });

router.put("/update", async (req, res) => {
  try {
    const token = req.headers["authorization"];

    const data = await jwt.verify(token, process.env.SECRET_KEY);

    const date = new Date().getTime();
    const value = `update users set user_name='${req.body.data.name}',user_email='${req.body.data.email}',user_registered=true,date = ${date},user_phone='${req.body.data.phone}' where user_id=${data.userId}`;

    connection.query(value, function (err, data) {
      if (err) {
        res.send("error" + err);
      } else {
        const composeMail = {
          from: process.env.EMAIL,
          to: req.body.data.email,
          subject: "Mail from Zocket",
          html: `
                  <div>
                  <p><b>Hi,${req.body.data.name}
                  </b>. <br/>We welcome to our platform</p>
                  <p>Thanks for registered the form</p>
                  <p>We will contact you soon.</p>
                  </div>
                  `,
        };

        sender.sendMail(composeMail, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log("mail sended successfully" + data.response);
          }
        });

        res.send(data);
      }
    });
  } catch (error) {
    res.json(error.message);
  }
});
module.exports = router;
