const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://rezoanshawon:GGDIRWtBpOQbJ6mX@cluster0.smadxws.mongodb.net/?retryWrites=true&w=majority";

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("Ema-John");
    const ProductCollection = database.collection("ProductCollection");

    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log(page, size);
      const query = {};
      const cursor = ProductCollection.find(query);
      const products = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await ProductCollection.countDocuments();
      res.send({ count, products });
    });

    app.post("/productsByid", async (req, res) => {
      const ids = req.body;
      const objectIds = ids.map((id) =>new ObjectId(id));
      const query = { _id: { $in: objectIds } };
      const cursor = ProductCollection.find(query);
      const productbyid = await cursor.toArray();
      res.send(productbyid);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port);
