const db = require("../../data/db-config");

async function bul() {
  const users = await db("users");

  return users.map((item) => {
    return { user_id: item.user_id, username: item.username };
  });
}

async function goreBul(filtre) {
  return await db("users").where(filtre);
}

async function idyeGoreBul(user_id) {
  let filtredById = await db("users").where("user_id", user_id).first();
  return { user_id: filtredById.user_id, username: filtredById.username };
}

async function ekle(user) {
  let insertUser = await db("users").insert(user);
  let insertedUser = await idyeGoreBul(insertUser);
  return insertedUser;
}
n.module.exports = {
  bul,
  goreBul,
  idyeGoreBul,
  ekle,
};
