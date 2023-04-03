const router = require("express").Router();
const { ekle, goreBul } = require("../users/users-model");
const bcrypt = require("bcryptjs");
const {
  sifreGecerlimi,
  usernameBostami,
  usernameVarmi,
} = require("./auth-middleware");
const e = require("express");

router.post(
  "/register",
  sifreGecerlimi,
  usernameBostami,
  async (req, res, next) => {
    try {
      let hashedPass = await bcrypt.hashSync(req.body.password);
      let model = { username: req.body.username, password: hashedPass };
      let insert = await ekle(model);
      res.status(201).json(insert);
    } catch (error) {
      next(error);
    }
  }
);
// `checkUsernameFree`, `checkUsernameExists` ve `checkPasswordLength` gereklidir (require)
// `auth-middleware.js` deki middleware fonksiyonları. Bunlara burda ihtiyacınız var!

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  
  response:
  status: 201
  {
    "user_id": 2,
    "username": "sue"
  }

  response username alınmış:
  status: 422
  {
    "message": "Username kullaniliyor"
  }

  response şifre 3 ya da daha az karakterli:
  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
 */

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status: 200
  {
    "message": "Hoşgeldin sue!"
  }

  response geçersiz kriter:
  status: 401
  {
    "message": "Geçersiz kriter!"
  }
 */
router.post("/login", usernameVarmi, (req, res, next) => {
  try {
    let isTrue = bcrypt.compareSync(req.body.password, req.existUser.password);
    if (isTrue) {
      req.session.user_id = req.existUser.user_id;
      res.json({ message: `Hoşgeldin ${req.body.username}` });
    } else {
      next({ status: 401, message: "Geçersiz kriter!" });
    }
  } catch (error) {
    next(error);
  }
});
/**
  3 [GET] /api/auth/logout

  response giriş yapmış kullanıcılar için:
  status: 200
  {
    "message": "Çıkış yapildi"
  }

  response giriş yapmamış kullanıcılar için:
  status: 200
  {
    "message": "Oturum bulunamadı!"
  }
 */
router.get("/logout", async (req, res, next) => {
  try {
    if (req.session.user_id) {
      req.session.destroy((err) => {
        if (err) {
          res.status(500).json({ message: "Logout hatası" });
        } else {
          res.json({ message: "Çıkış yapildi" });
        }
      });
    } else {
      res.status(200).json({ message: "Oturum bulunamadı!" });
    }
  } catch (error) {
    next(error);
  }
});

// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.

module.exports = router;
