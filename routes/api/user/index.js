const router = require("express").Router();
const { userModel } = require("../../../models");
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
    const user = await userModel.create(req.body);

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

    const composeMail = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Mail from Zocket",
      html: `
              <div>
              <p><b>Hi, This is Prakash from Zocket.
              </b>. We welcome to our platform</p>
              <p>To register the form, click below</p>
              <a href="http://localhost:3000/verify/${token}">
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

    res.send(user);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/get", async (req, res) => {
  const token = req.headers["authorization"];

  const data = await jwt.verify(token, process.env.SECRET_KEY);
  const user = await userModel.findById({ _id: data.userId });
  res.json(user);
});

router.put("/update", async (req, res) => {
  try {
    const token = req.headers["authorization"];

    const data = await jwt.verify(token, process.env.SECRET_KEY);

    const user = await userModel.findByIdAndUpdate(
      { _id: data.userId },
      { name: req.body.data.name, phone: req.body.data.phone,registered:true },
      { new: true }
    );
    const composeMail = {
      from: process.env.EMAIL,
      to: req.body.data.email,
      subject: "Mail from Zocket",
      html: `
              <div>
              <p><b>Hi,${req.body.data.name}.
              </b>. We welcome to our platform</p>
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

    res.send(user);
    
  } catch (error) {
    res.json(error.message);
  }
});
module.exports = router;
