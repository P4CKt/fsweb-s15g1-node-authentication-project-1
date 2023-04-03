const db = require("../../data/db-config");

async function bul() {
  const users = await db("users");

  const allUsers = users.map((item) => {
    return { user_id: item.user_id, username: item.username };
  });
  return allUsers;
}

async function goreBul(filtre) {
  return await db("users").where(filtre);
}

async function idyeGoreBul(user_id) {
  let filtredById = await db("users").where("user_id", user_id).first();
  return { username: filtredById.username, user_id: filtredById.user_id };
}

async function ekle(user) {
  let insertUser = await db("users").insert(user);
  return idyeGoreBul(insertUser[0]);
}
module.exports = {
  bul,
  goreBul,
  idyeGoreBul,
  ekle,
};
