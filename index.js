const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const multer = require("multer");
// app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "chatting",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/Images");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.json("hola");
});

app.use(express.static("public"));

app.post("/home", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error getting connection from pool" });
    }
    const search = req.body.search;
    const cur_id = req.body.cur_id;
    console.log("this is serach");
    console.log(search);
    const sql = `select * from chatting.users where user_name LIKE'%${search}%' and user_id!='${cur_id}'`;
    connection.query(sql, (err, data) => {
      connection.release();
      if (err) return res.json(err);
      console.log(res.json.data);
      return res.json(data);
    });
  });
});

app.get("/usersdata", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error getting connection from pool" });
    }
    const sql = "select * from users";
    connection.query(sql, (err, data) => {
      connection.release();
      if (err) return res.json(err);
      return res.json(data);
    });
  });
});

app.post("/side", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error getting connection from pool" });
    }
    const sender = req.body.cur_id;
    console.log("sender id");
    console.log(sender);
    const reciever = req.body.reciever;
    const name = req.body.name;
    console.log(reciever);
    const firstsql = `select * from requests where fromId=${sender} and toId=${reciever}`;
    const sql = `insert into  chatting.requests values(${sender},${reciever},0,'${name}')`;
    connection.query(firstsql, (err, data) => {
      connection.release();
      if (err) {
        console.log(err);
        res.status(500).json({ err: "error in inserting the data" });
      } else if (data.length > 0) {
        // console.log("inserted successfuly");
        // res.status(200).json("sended request");
        console.log("already inserted");
        res.status(200).json("already inserted ra");
      } else {
        connection.query(sql, (err, data) => {
          connection.release();
          if (err) {
            console.log(err);
            res.status(500).json({ err: "error in inserting the data" });
          } else {
            console.log("inserted successfuly");
            res.status(200).json("sended request");
          }
        });
      }
    });
  });
});

app.post("/getdp", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error getting connection from pool" });
    }

    const id = req.body.id;
    const sql = `select dp from users where user_id=${id}`;
    connection.query(sql, (err, data) => {
      connection.release();
      if (err) {
        res.status(500).json({ err: "error in getting the dp" });
      } else {
        console.log(data);
        res.status(200).json(data[0]);
      }
    });
  });
});

//inserting the users dp
app.post("/dp", upload.single("file"), (req, res) => {
  console.log(req.body);
  console.log(req.file.filename);
  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "error in getting connection from pool" });
    }
    const name = req.file.filename;
    const id = req.body.id;
    console.log(id);
    const sql = `UPDATE users SET dp = '${name}' WHERE (user_id = ?);`;
    connection.query(sql, [id], (err, data) => {
      connection.release();
      if (err) {
        console.log(err, "error in insertin the dp into users table");
        return res.status(500).json({ err });
      }
      console.log("successfully inserted the users dp");
      return res.status(200).json(data[0], "successfull");
    });
  });
});

app.post("/usersdata", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error getting connection from pool" });
    }
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    console.log(password);
    const sql = `select * from users where email='${email}' and user_password='${password}'`;
    connection.query(sql, (err, data) => {
      connection.release();
      if (err) {
        console.log("hi");
        res.status(500).json({ err: "error in fetching the data" });
      } else {
        console.log(data);
        res.status(200).json(data[0]);
      }
    });
  });
});

app.post("/getIdsign", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error getting connection from pool" });
    }
    const email = req.body.email;
    const username = req.body.username;
    const sql = `select * from users where email='${email}' and user_name='${username}'`;
    connection.query(sql, (err, data) => {
      connection.release();
      if (err) {
        console.log("error in getting the user id from the sign in page");
        return res.status(500).json({ err });
      } else {
        console.log("getting it");
        console.log(data[0].user_id);
        return res.status(200).json(data[0].user_id);
      }
    });
  });
});

app.post("/signup", upload.single("file"), (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error getting connection from pool" });
    }
    const file = req.file.filename;
    const { email, username, password } = req.body;
    // const email = req.body.email;
    // const username = req.body.username;
    // const password = req.body.password;

    const sql = [
      `INSERT INTO chatting.users (user_name, email, user_password,dp) VALUES (?, ?, ?,?)`,
      // `CREATE TABLE chatting.${username}_requests (person_id VARCHAR(22), status VARCHAR(10))`,
      // `select user_id from users where `
      `CREATE TABLE chatting.${username}_chat (toId int ,fromId int ,msg varchar(1000),at_date date,at_time time)`,
      // `CREATE TABLE chatting.${username}_friends (friend_id VARCHAR(100), friends_username VARCHAR(100), friends_mail VARCHAR(100))`,
    ];
    console.log({ username });
    console.log({ email });
    console.log({ password });
    console.log({ file });
    connection.query(sql[0], [username, email, password, file], (err, data) => {
      connection.release();
      if (err) {
        res.status(500).json({ err: "error in inserting the data" });
      } else {
        console.log("inserted successfully");
        let createQueries = sql.slice(1);
        createTables(createQueries, res);
      }
    });

    function createTables(queries, res) {
      if (queries.length === 0) {
        console.log("All tables created successfully");
        res.status(200).json("User registered successfully");
        return;
      }
      const query = queries.shift(); // Get the first query from the array
      connection.query(query, (err, tableData) => {
        connection.release();
        if (err) {
          console.error("Error creating table:", err);
          res.status(500).json({ err: "Error in creating table" });
        } else {
          console.log("Table created successfully:", query);
          createTables(queries, res); // Recursively call to create next table
        }
      });
    }
  });
});

app.post("/requests", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error getting connection from pool" });
    }
    const toId = req.body.presentUserId;
    console.log(toId, "this is to id ra babu");
    const sql = `select * from requests inner join users on requests.fromId=users.user_id where requests.toId=${toId}`;
    connection.query(sql, (err, data) => {
      connection.release();
      if (err) {
        console.log(err);
        return res.status(500).json(err, "error in fetching the requests ");
      }
      console.log(data);
      return res.json(data);
    });
  });
});

app.post("/accept", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      return res.status(500).json("error in connecting to backend");
    }
    const from = req.body.from;
    const to = req.body.to;
    console.log(from, to);
    const firstsql = `select status from requests where fromId=${from} and toId=${to}`;
    const sql = `update requests set status=1 where fromId=${from} and toId=${to}`;
    const secondsql = `insert into friendship(userId1,userId2) values(${from},${to})`;
    connection.query(firstsql, (err, data) => {
      connection.release();
      console.log(data);
      if (data[0].status === 0) {
        console.log(data, "this is data ra ");
        res.status(404).json("already accepted");
        connection.query(sql, (err, data) => {
          connection.release();
          if (err) {
            console.log(err);
            res.status(500).json(err);
          }
          console.log("success in adding to friend list");
          connection.query(secondsql, (err, data) => {
            connection.release();
            if (err) {
              console.log(err);
              res.status(500).json(err);
            }
            console.log("inserted into friendship table");
            res.status(200).json("success full added to friends list");
          });
        });
      }
    });
  });
});

app.post("/getFriends", (req, res) => {
  console.log("came to get friends method");
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    }
    const cur_id = req.body.cur_id;
    const sql = `select distinct 
    users.* from users
    inner join friendship
    on users.user_id=friendship.userId1 or users.user_id=friendship.userId2
    where friendship.userId1=${cur_id} or friendship.userId2=${cur_id}`;
    connection.query(sql, (err, data) => {
      connection.release();
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
      console.log(data);
      res.status(200).json(data);
    });
  });
});

app.post("/getmessages", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    }
    const pId = req.body.pId;
    const friend = req.body.friend;
    console.log(friend);
    const sql = `SELECT * FROM chats where (fromid=${pId} and toId=${friend}) or(fromid=${friend} and toId=${pId})`;
    connection.query(sql, (err, data) => {
      connection.release();
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      console.log(data);
      return res.status(200).json(data);
    });
  });
});

app.listen(8000, () => {
  console.log("connected to backend");
});
