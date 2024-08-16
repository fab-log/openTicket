const express = require("express");
const fs = require("fs");

const app = express();
app.listen(22, () => console.log("listening at 22"));
app.use(express.static("public"));
app.use(express.json({ limit: "100mb" }));

app.get("/api.tickets", (request, response) => {
    fs.readFile("./tickets.json", "utf8", (err, tickets) => {
        if (err) throw err;
        response.send(tickets);
    });
});

app.post("/api.tickets", (request, response) => {
    const data = request.body;
    fs.readFile("./tickets.json", "utf8", (err, tickets) => {
        if (err) throw err;
        let ticketsArray = JSON.parse(tickets);
        ticketsArray.push(data);
        let ticketsString = JSON.stringify(ticketsArray);
        fs.writeFile("./tickets.json", ticketsString, (err) => {
            if (err) throw err;
            response.json(ticketsArray.at(-1));
        });
    });
});

app.post("/api.saveEntry", (request, response) => {
    const data = request.body;
    const index = request.headers.index;
    console.log("index: " + index);
    fs.readFile("./tickets.json", "utf8", (err, tickets) => {
        if (err) throw err;
        let ticketsArray = JSON.parse(tickets);
        ticketsArray[index].subtasks.push(data);
        let ticketsString = JSON.stringify(ticketsArray);
        fs.writeFile("./tickets.json", ticketsString, (err) => {
            if (err) throw err;
            response.json(ticketsArray[index].subtasks.at(-1));
        });
    });
});

app.post("/api.updateTicket", (request, response) => {
    const data = request.body;
    const index = request.headers.index;
    fs.readFile("./tickets.json", "utf8", (err, tickets) => {
        if (err) {
            console.error(err);
            response.status(500).json({ error: "Internal Server Error" });
            return;
        }
        let ticketsArray = JSON.parse(tickets);
        if (data.title.length != 0) {
            ticketsArray[index].title.push(data.title)
        }
        if (data.dueDate.length != 0) {
            ticketsArray[index].dueDate.push(data.dueDate)
        }
        if (data.prio.length != 0) {
            ticketsArray[index].prio.push(data.prio)
        }
        if (data.hue.length != 0) {
            ticketsArray[index].bubbleHue.push(data.hue)
        }
        if (data.description.length != 0) {
            ticketsArray[index].description.push(data.description)
        }
        let ticketsString = JSON.stringify(ticketsArray);
        fs.writeFile("./tickets.json", ticketsString, (err) => {
            if (err) {
                console.error(err);
                response.status(500).json({ error: "Internal Server Error" });
                return;
            }
            response.json(ticketsArray);
        });
    });
});

app.post("/api.updateEntry", (request, response) => {
    const data = request.body;
    const index = request.headers.index;
    const subId = request.headers.subid;
    fs.readFile("./tickets.json", "utf8", (err, tickets) => {
        if (err) {
            console.error(err);
            response.status(500).json({ error: "Internal Server Error" });
            return;
        }
        let ticketsArray = JSON.parse(tickets);
        ticketsArray[index].subtasks[subId].date.push(data.date);
        ticketsArray[index].subtasks[subId].editor.push(data.editor);
        if (data.type.length != 0) {
            ticketsArray[index].subtasks[subId].type.push(data.type);
        }
        if (data.state.length != 0) {
            ticketsArray[index].subtasks[subId].state.push(data.state);
        }
        if (data.note.length != 0) {
            ticketsArray[index].subtasks[subId].note.push(data.note);
        }
        let ticketsString = JSON.stringify(ticketsArray);
        fs.writeFile("./tickets.json", ticketsString, (err) => {
            if (err) {
                console.error(err);
                response.status(500).json({ error: "Internal Server Error" });
                return;
            }
            response.json(ticketsArray);
        });
    });
});
