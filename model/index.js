const { MongoClient } = require("mongodb")

const andmebaas = "matkaapp2410"
const salasona = process.env.MONGO_PWD

const mongoUrl = `mongodb+srv://matkaapp2410:${salasona}@cluster0.fnenu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const client = new MongoClient(mongoUrl);

async function lisaMatk(uusMatk) {
    try {
        await client.connect();
        const database = client.db(andmebaas);
        const matkad = database.collection("matkad");
        const result = await matkad.insertOne(uusMatk)
        console.log(`A document was inserted with the _id: ${result.insertedId}`)
    } finally {
        await client.close();
    }
     
}

async function lisaRegistreerumine(uusRegistreerumine) {

}

module.exports = {
    lisaMatk,
    lisaRegistreerumine
}