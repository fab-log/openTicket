const express = require("express");
const fs = require("fs");
const { request } = require("http");

const app = express();
app.use(express.static("public"));
app.use(express.json({ limit: "100mb" }));

const port = 8001;
app.listen(port, () => console.log(`listening at ${port}`));

/* const cyphers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

const randomCyphers = (length) => {
    let randomString = "";
    for (i = 0; i < length; i++) {
        randomString += cyphers[Math.floor(Math.random() * cyphers.length)];
    }
    return randomString;
} */

app.post("/api.createAccount", (request, response) => {
    const data = request.body;
    let res = {};
    // let newId = `user_${Date.now()}_${randomCyphers(10)}`;
    fs.readFile("./users.json", "utf8", (err, users) => {
        if (err) throw err;
        let usersArray = JSON.parse(users);
        let emails = [];
        usersArray.forEach(e => {
            emails.push(e.email.at(-1)[2]);
            console.log("found email: " + e.email.at(-1)[2]);
        });
        if (emails.find((element) => element === data.email.at(-1)[2])) {
            response.json({ status: "Email already exists." });
            return;
        }
        usersArray.push(data);
        let usersArrayString = JSON.stringify(usersArray);
        fs.writeFile("./users.json", usersArrayString, (err) => {
            if (err) {
                res.status = err;
                response.json(res);
                console.log(res.status);
                throw err;
            }
            let newFileName = `./tickets_${data.id}.json`;
            let newFile = [];
            let newFileString = JSON.stringify(newFile);
            fs.writeFile(newFileName, newFileString, (err) => {
                if (err) {
                    res.status = err;
                    response.json(res);
                    console.log(res.status);
                    throw err;
                }
                res.status = `Account successfully created for ${data.firstName.at(-1)[2]} ${data.lastName.at(-1)[2]}<br />
                    You are now logged in as ${data.email.at(-1)[2]}`;
                delete data.password;
                res.data = data;
                response.json(res);
            });

        });
    });
});

app.post('/api.login', (request, response) => {
    const data = request.body;
    fs.readFile("./users.json", "utf8", (err, users) => {
        if (err) {
            res.status = err;
            response.json(res);
            console.log(res.status);
            throw err;
        }
        let parsedUserData = JSON.parse(users);
        let emails = [];
        parsedUserData.forEach(e => {
            emails.push(e.email.at(-1)[2]);
        });
        let index = emails.indexOf(data.email);
        // let index = parsedUserData.findIndex(e => e.email === data.email);
        let res = {};
        if (index === -1) {
            res.status = "email does not exist";
            response.json(res);
        } else if (parsedUserData[index].password.at(-1)[2] != data.password) {
            res.status = "password incorrect";
            response.json(res);
        } else if (parsedUserData[index].email.at(-1)[2] === data.email && parsedUserData[index].password.at(-1)[2] === data.password) {
            res.status = "OK";
            delete parsedUserData[index].password;
            res.data = parsedUserData[index];
            response.json(res);
        }
    });
});

app.post('/api.quickLogin', (request, response) => {
    const data = request.body;
    fs.readFile("./users.json", "utf8", (err, users) => {
        if (err) {
            res.status = err;
            response.json(res);
            console.log(res.status);
            throw err;
        }
        let parsedUserData = JSON.parse(users);
        let index = parsedUserData.findIndex(e => e.id === data.id);
        let res = {};
        if (index === -1) {
            res.status = "Error! Please try to log in again";
            response.json(res);
        } else {
            res.status = "OK";
            delete parsedUserData[index].password;
            res.data = parsedUserData[index];
            response.json(res);
        }
    });
});

app.post("/api.editPersonalData", (request, response) => {
    const data = request.body;
    let res = {};
    fs.readFile("./users.json", "utf8", (err, users) => {
        if (err) {
            res.status = err;
            response.json(res);
            console.log(res.status);
            throw err;
        }
        let parsedUserData = JSON.parse(users);
        let index = parsedUserData.findIndex(e => e.id === data.id);
        if (data.firstName) { parsedUserData[index].firstName.push([Date.now(), parsedUserData[index].id, data.firstName]) };
        if (data.lastName) { parsedUserData[index].lastName.push([Date.now(), parsedUserData[index].id, data.lastName]) };
        if (data.email) { parsedUserData[index].email.push([Date.now(), parsedUserData[index].id, data.email]) };
        if (data.oldPassword) {
            if (data.oldPassword != parsedUserData[index].password.at(-1)[2]) {
                res.status = "password incorrect";
                response.json(res);
                return;
            }
            parsedUserData[index].password.push([Date.now(), parsedUserData[index].id, data.newPassword]);
            res.alert = "password successfully changed";
        }
        let usersArrayString = JSON.stringify(parsedUserData);
        fs.writeFile("./users.json", usersArrayString, (err) => {
            if (err) {
                res.status = err;
                response.json(res);
                console.log(res.status);
                throw err;
            }
            res.status = "OK";
            delete parsedUserData[index].password;
            res.data = parsedUserData[index];
            response.json(res);
        });
    });
});

app.post("/api.deleteAccount", (request, response) => {
    const data = request.body;
    let res = {};
    fs.readFile("./users.json", "utf8", (err, users) => {
        if (err) {
            res.status = err;
            response.json(res);
            console.log(res.status);
            throw err;
        }
        let parsedUserData = JSON.parse(users);
        let index = parsedUserData.findIndex(e => e.id === data.id);
        if (parsedUserData[index].password.at(-1)[2] != data.password) {
            res.status = "password incorrect!";
            response.json(res);
            return;
        }
        parsedUserData.splice(index, 1);
        let usersArrayString = JSON.stringify(parsedUserData);
        fs.writeFile("./users.json", usersArrayString, (err) => {
            if (err) {
                res.status = err;
                response.json(res);
                console.log(res.status);
                throw err;
            }
            let fileName = `./tickets_${data.id}.json`;
            fs.unlink(fileName, (err) => {
                if (err) {
                    res.status = err;
                    response.json(res);
                    console.log(res.status);
                    throw err;
                }
                console.log(`File ${fileName} has been successfully removed.`);
                res.status = "OK";
                res.id = data.id;
                response.json(res);
            });
        });
    });
});

app.post("/api.getTickets", (request, response) => {
    let data = request.body;
    let fileName = `./tickets_${data.id}.json`;
    let res = {};
    fs.readFile(fileName, "utf8", (err, tickets) => {
        if (err) {
            res.status = err;
            response.json(res);
            console.log(res.status);
            throw err;
        }
        let userTickets = JSON.parse(tickets);
        res.status = "OK";
        res.tickets = userTickets;
        response.json(res);
    });
});

app.post("/api.newTicket", (request, response) => {
    let data = request.body;
    let fileName = `./tickets_${data.id}.json`;
    let res = {};
    fs.readFile(fileName, "utf8", (err, tickets) => {
        if (err) throw err;
        let ticketsArray = JSON.parse(tickets);
        ticketsArray.push(data.ticket);
        let ticketsString = JSON.stringify(ticketsArray);
        fs.writeFile(fileName, ticketsString, (err) => {
            if (err) throw err;
            res.status = "OK";
            res.tickets = ticketsArray;
            response.json(res);
        });
    });
});

app.post("/api.updateTicket", (request, response) => {
    const data = request.body;
    let fileName = `./tickets_${data.userId}.json`;
    fs.readFile(fileName, "utf8", (err, tickets) => {
        if (err) {
            console.error(err);
            response.status(500).json({ error: "Internal Server Error" });
            return;
        }
        let ticketsArray = JSON.parse(tickets);
        console.log("user id: " + data.userId);
        console.log("ticket id: " + data.ticketId);
        let index = ticketsArray.findIndex((e) => e.id === data.ticketId);
        console.log({ index });
        ticketsArray.splice(index, 1, data.ticket);
        // ticketsArray.push(data);
        let ticketsString = JSON.stringify(ticketsArray);
        fs.writeFile(fileName, ticketsString, (err) => {
            if (err) {
                console.error(err);
                response.status(500).json({ error: "Internal Server Error" });
                return;
            }
            let res = {};
            res.status = "OK";
            res.tickets = ticketsArray;
            response.json(res);
        });
    });
});

app.post("/api.deleteOldTickets", (request, response) => {
    const data = request.body;
    let fileName = `./tickets_${data.userId}.json`;
    fs.readFile(fileName, "utf8", (err, tickets) => {
        if (err) {
            console.error(err);
            response.status(500).json({ error: "Internal Server Error" });
            return;
        }
        let ticketsArray = JSON.parse(tickets);
        let cleanedUpArray = ticketsArray.filter(obj => obj.prio.at(-1)[2] != -1);
        let ticketsString = JSON.stringify(cleanedUpArray);
        fs.writeFile(fileName, ticketsString, (err) => {
            if (err) {
                console.error(err);
                response.status(500).json({ error: "Internal Server Error" });
                return;
            }
            let res = {};
            res.status = "OK";
            res.tickets = cleanedUpArray;
            response.json(res);
        });
    });
})