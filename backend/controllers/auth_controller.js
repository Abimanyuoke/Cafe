import md5 from "md5";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const secretKey = "moklet"; //bisa diganti, kode yang dijadikan password

export const authenticate = async (req, res) => { //login memastikan data yang dikirim sesuai
  const { username, password } = req.body;

  try {
    const userCek = await prisma.user.findFirst({ 
      where: {
        username: username,
        password: md5(password),
      },
    });
    if (userCek) {
      const payload = JSON.stringify(userCek);
      const token = jwt.sign(payload, secretKey);
      res.status(200).json({
        succes: true,
        logged: true,
        message: "login succes",
        token: token,
        loggedin: userCek.username,
      });
    } else {
      res.status(404).json({
        succes: false,
        logged: false,
        message: "username or password invalid",
      });
    }
  } catch (error) {
    console.log("cek");
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const authorize = async (req, res, next) => { //memilah
  try {
    const authHeader = req.headers["authorization"];
    console.log("cek authHeader " + authHeader);
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const verifiedUser = jwt.verify(token, secretKey); //random token akan di buat oleh JWT (Json Web Token)
      if (!verifiedUser) {
        res.json({
          succes: false,
          auth: false,
          message: "cannot permission to acces",
        });
      } else {
        req.user = verifiedUser;
        next();
      }
    } else {
      res.json({
        succes: false,
        message: "can't permission access",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
