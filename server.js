//Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { RSA_NO_PADDING } = require('constants');

//Async Processes
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//Sets the Express App
const app = express();
const PORT = process.env.PORT || 8080;

//To enable middleware body parsing
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Static Middleware
app.use(express.static("./public"));

//"GET" request
app.get("/api/notes", (req, res) => {
    readFileAsync("./db/db.json", "utf8").then((data) => {
        notes = [].concat(JSON.parse(data));
        res.json(notes);
    })
});

//"POST" request
app.post("/api/notes", (req, res) => {
    const note = req.body;
    readFileAsync("./db/db.json", "utf8").then((data) => {
        const notes = [].concat(JSON.parse(data));
        note.id = notes.length + 1;
        notes.push(note);
        return notes;
    }).then((notes) => {
        writeFileAsync("./db/db.json", JSON.stringify(notes));
        res.json(note);
    })
});

//"DELETE" request
app.delete("/api/notes/:id", (req, res) => {
    const idToDelete = parseInt(req.params.id);
    readFileAsync("./db/db.json", "utf8").then((data) => {
        const notes = [].concat(JSON.parse(data));
        const newNotesData = [];
        for (let i = 0; i < notes.length; i++) {
            if(idToDelete !== notes[i].id) {
                newNotesData.push(notes[i]);
            } 
        }
        return newNotesData;
    }).then((notes) => {
        writeFileAsync("./db/db.json", JSON.stringify(notes));
        res.send("Successful!");
    })
})

//HTML Routes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));

});




app.listen(PORT, () =>{
    console.log(`App listening on PORT ${PORT}`);
});
