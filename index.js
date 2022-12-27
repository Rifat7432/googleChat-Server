const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5555;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("GoogleChat  server is working");
});

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.bwyqvv1.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const UserCollection = client.db("GoogleChat").collection("Users");
    const ChatCollection = client.db("GoogleChat").collection("Chats");
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await UserCollection.insertOne(user);
      res.send(result);
    });
    app.get("/friend/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await UserCollection.findOne(query);
      res.send(result);
    });
    app.get("/friends/:email", async (req, res) => {
      const email = req.params.email;
      const query = { friendList: { $in: [email] } };
      const result = await UserCollection.find(query).toArray();
      res.send(result);
    });
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const friend = req.body;
      const filter = { email: email };
      const user = await UserCollection.findOne(filter);
      const friendList = user?.friendList;
      friendList.push(friend);
      const options = { upsert: true };
      const updateGameDoc = {
        $set: {
          friendList: friendList,
        },
      };
      const updateGame = await UserCollection.updateOne(
        filter,
        updateGameDoc,
        options
      );
      res.send(updateGame);
    });
  
    app.get("/chats", async (req, res) => {
      const user1 = req.query.user1;
      const user2 = req.query.user2;
      const query = {
        person1: user1,
        person2: user2,
        type: "inbox",
      };
      const result = await ChatCollection.findOne(query);
      if (!result) {
        const query1 = {
          person2: user1,
          person1: user2,
          type: "inbox",
        };
        const finalResult = await ChatCollection.findOne(query1);
        return res.send(finalResult);
      }
      res.send(result);
    });
    app.put("/Chat/:id", async (req, res) => {
      const id = req.params.id;
      const massages = req.body;
      const filter = { _id: ObjectId(id) };

      const options = { upsert: true };
      const updateChatDoc = {
        $set: {
          massages: massages,
        },
      };
      const updateChat = await ChatCollection.updateOne(
        filter,
        updateChatDoc,
        options
      );
      res.send(updateChat);
    });
  } finally {
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
