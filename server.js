const express = require("express");
const path = require("path");
const fs = require("fs");

const server = express();
const PORT = process.env.PORT || 3000;

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.static('public'))

server.get("/notes", function (request, response) {
    response.sendFile(path.join(__dirname, "public/notes.html"));
});

server.get("/api/notes", function (request, response) {
    fs.readFile("./db/db.json", 'utf8', (error, data) => {
        if (error) throw error;
        if (data) {
            response.json(JSON.parse(data));
        } else {
            response.json([]);
        }
    });
});


server.post("/api/notes", function (request, response) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json"));
    let newNote = request.body;
    if (savedNotes.length === 0) {
        newNote.id = 0;
    } else {
        let positionOfObjectToAccess = savedNotes.length - 1;
        let lastIdUsed = savedNotes[positionOfObjectToAccess].id;
        newNote.id = lastIdUsed + 1;
    }
    savedNotes.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
        return response.json(savedNotes);
    });

server.delete("/api/notes/:id", function (request, response) {
    const oldData = JSON.parse(fs.readFileSync("./db/db.json"));
    const newDeletedArray = oldData.filter((object) => { return object.id != request.params.id });
    fs.writeFileSync("./db/db.json", JSON.stringify(newDeletedArray));
    return response.json(newDeletedArray);
});


server.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, "public/index.html"));
});

server.listen(PORT, function () {
    console.log("Server listening on PORT " + PORT);
});