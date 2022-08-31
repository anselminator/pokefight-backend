const pokeDex = require("./pokemon.json");
var express = require("express");
var cors = require("cors");
var app = express();
var port = process.env.PORT || 3000;

app.use(cors());
app.get("/pokemon", (req, res) => {
    res.send(pokeDex);
});
app.get("/pokemon/:id", (req, res) => {
    const pid = parseInt(req.params.id);
    console.log("pokemon id requested :", pid);
    const pokemon = pokeDex.find((e) => {
        console.log(
            "why is this ",
            parseInt(e.id),
            " not equal to this?:",
            parseInt(pid)
        );
        return e.id === pid;
    });
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
