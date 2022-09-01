const pokeDex = require("./pokemon_stringy.json");
var express = require("express");
var cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const morgan = require("morgan");
const { fail } = require("assert");

var app = express();
var port = process.env.PORT || 3000;

app.use(morgan("dev"));

app.get("/pokemon", (req, res) => {
    console.log("here are all pokemon:");
    res.send(pokeDex);
});
app.get("/pokepictures", (req, res) => {
    let promises = [];
    let failures = [];
    for (let i = 720; i < 809; i++) {
        const n = pokeDex[i].name.english.toLowerCase();
        console.log("trying to fetch pictures for .... ", i, n);
        promises.push(
            axios
            .get(`https://pokeapi.co/api/v2/pokemon/${n}/`)
            .then((r) => {
                console.log("pokeapi succes: ", r.data.name);
                pokeDex[i] = {
                    ...pokeDex[i],
                    pictureFront: r.data.sprites.front_default,
                };
                pokeDex[i] = {
                    ...pokeDex[i],
                    pictureBack: r.data.sprites.back_default,
                };
                console.log("final result:", pokeDex[i].id);
            })
            .catch((e) => {
                failures.push(e);
                console.log("PokeAPI fail: ", e.message);
            })
        );
    }

    Promise.all(promises).then(() => {
        //        console.log("FFFIINNNNAAALLLL result:", pokeDex.slice(200, 300));
        console.log("TOtal failures: ", failures);
        fs.writeFile("./pokemon_new.json", JSON.stringify(pokeDex), (err) => {
            if (err) {
                console.log(err);
                throw err;
            }
        });
        res.send(pokeDex);
    });
});
app.get("/pokepicture/:id", (req, res) => {
    const n = parseInt(req.params.id);
    const i = pokeDex.findIndex((e) => e.id === n);
    console.log("trying to fetch pictures for .... ", i, n);
    axios.get(`https://pokeapi.co/api/v2/pokemon/${n}/`).then((r) => {
        console.log("pokeapi said: ", r.data.name);
        pokeDex[i] = {...pokeDex[i], pictureFront: r.data.sprites.front_default };
        pokeDex[i] = {...pokeDex[i], pictureBack: r.data.sprites.back_default };
        console.log("final result:", pokeDex[i]);
    });
    console.log(" back outside async call ");
    res.send("poke pic " + pokeDex[i]);
});
app.get("/pokemon/:id", (req, res) => {
    const pid = parseInt(req.params.id);
    console.log("pokemon id requested :", pid);
    const pokemon = pokeDex.find((e) => e.id === pid);
    console.log("Found this critter:", pokemon);
    res.send(pokemon);
});

app.get("/pokemon/:id/:info", (req, res) => {
    const pid = parseInt(req.params.id);
    const pinfo = req.params.info;
    console.log("pokemon id requested :", pid);
    const pokemon = pokeDex.find((e) => e.id === pid);
    console.log("Found this critter:", pokemon);
    console.log("and has this stat:", pinfo, pokemon[pinfo]);
    res.send(pokemon[pinfo]);
});

var server = app.listen(port, () =>
    console.log(`Server is listening on port ${port}`)
);