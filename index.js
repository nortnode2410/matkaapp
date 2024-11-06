const express = require('express')
const ejs = require('ejs')
const path = require("path")

const {lisaMatk, lisaRegistreerumine, loeMatkad, muudaMatk} = require("./model")

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const PORT = process.env.PORT || 3030

let matkad = []
const s6nunid = []

function registreeruMatkale(matkaIndex, nimi, email) {
    if (matkaIndex > matkad.length) {
        console.log("Vale matka indeks")
        return
    }
    const matk = matkad[matkaIndex]
    const uusMatkaja = {
        nimi: nimi,
        email: email,
        registreerumiseAeg: new Date()
    }
    matk.osalejad.push(uusMatkaja)
    console.log(matkad)
    muudaMatk(matk)
}


app.get('/test', (req, res) => {res.end('kõik töötab!')})
app.use('/', express.static("public"))

app.get('/', async (req, res)=> {
     matkad = await loeMatkad()
     res.render("esileht", {matkad: matkad}) 
    })
app.get('/matk/:matkId', (req, res) => {
    const matkaIndex = req.params.matkId
    res.render("matk", { matk: matkad[matkaIndex], id: matkaIndex }) 
})

app.get('/registreerumine', (req, res) => {
   registreeruMatkale(req.query.matkaIndex,req.query.nimi,req.query.email)
   res.render('reg_kinnitus', {matk: matkad[req.query.matkaIndex], matkaja: req.query.nimi})
})

app.post('/registreerumine', (req, res) => {
    console.log(req.body)
    registreeruMatkale(req.body.matkaIndex, req.body.nimi, req.body.email)
    res.render('reg_kinnitus', {matk: matkad[req.body.matkaIndex], matkaja: req.body.nimi})
 })

 app.post('/sonum', (req, res) => {
    //kontrolli console.log abil, kas andmed jõuavad kohale
    console.log(req.body)
    // tee funktsioon mis salvestab saadud andmed sõnumite massiivi
    // s6numid.push(uusSonum)

    //renderda mall sõnumi kättesaamise kohta

    console.log(s6numid)
 })

 app.get('/api/lisaMatk', (req, res )=>{
    const uusMatk = {
        nimetus : req.query.nimetus
    }
    lisaMatk(uusMatk);
    res.end("Lisatud")
 })

 app.get('/api/lisaRegistreerumine', (req, res) => {
    const uusRegistreerumine = {
        matkaIndeks: req.query.matkaIndeks,
        nimi: req.query.nimi,
        email: req.query.email
    }
    lisaRegistreerumine(uusRegistreerumine)
    res.end()
 })


 app.get('/admin', (req, res) => { res.render("admin") } )

 //Meetodid andmeoperatsioonide jaoks
 // read loe
 // post lisa
 // delete kustuta
 // put - andemkirjete muutmine 
 // patch - andmekirjete täiendamiseks
 
 //api endpoint matkade nimekirja laadimiseks
 app.get('/api/matk', async (req, res) => {
    matkad = await loeMatkad()
    res.json(matkad)
 } )

 //api endpoint ühe matka andmete laadimiseks
 app.get('/api/matk/:matkIndeks', (req,res) => {
    const matk = matkad[req.params.matkIndeks]
    if (!matk) {
        res.status(404).end()
        return
    }

    res.json(matk)
 } )

 //api endpoint ühe matka lisamiseks
 app.post('/api/matk', (req, res) => {
    const uusMatk  = {
        nimetus: req.body.nimetus,
        kirjeldus: req.body.kirjeldus,
        pildiUrl: req.body.pildiUrl,
    }
    
    uusMatk.osalejad = []
    uusMatk.matkIndeks = matkad.length
    lisaMatk(uusMatk)

    console.log(uusMatk)
    matkad.push(uusMatk)
    //todo: lisa matk ka MongoDb andmebaasi
    res.json(uusMatk)
 })

 //ühe matka kustutamine
 app.delete('/api/:matkaIndeks')

 //ühe matka andmete muutmine
 app.patch('/api/:matkaIndeks')

 //ühe matka kõigi osalejate laadimiseks
 app.get('/api/matk/:matkaIndeks/osaleja')

 //ühe matka ühte osaleja laadimine
 app.get('/api/matk/:matkaIndeks/osaleja/:osalejaIndeks')
 
 //ühe matka ühte osaleja kustutamine
 app.delete('/api/matk/:matkaIndeks/osaleja/:osalejaEmail', async (req, res) => {
    if (matkad.length < 1) {
        matkad = await loeMatkad()
    }

    console.log('Kustutame matka', req.params.matkaIndeks, 'osaleja', req.params.osalejaEmail )
    const matk = matkad[req.params.matkaIndeks]
    if (!matk) {
        console.log('matka ei leitud')
        res.status(404).end()
    }

    console.log(matk.osalejad)
    const muudetudOsalejad = matk.osalejad.filter(o => o.email !== req.params.osalejaEmail)

    console.log(muudetudOsalejad)
    matk.osalejad = muudetudOsalejad
    muudaMatk(matk)

    res.json(matk)
 }) 



app.listen(PORT)