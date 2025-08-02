const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.json({ limit: "100mb" }));

const fs = require("fs");
const crypto = require('crypto');
// const { request } = require("http");
const nodemailer = require('nodemailer');
require('dotenv').config();

const port = 8005;


// ############
// ### MAIL ###
// ############

const transporter = nodemailer.createTransport({
    host: process.env.NOREPLY_HOST,
    port: process.env.NOREPLY_PORT,
    secure: true,
    auth: {
      user: process.env.NOREPLY_MAIL_ADDRESS,
      pass: process.env.NOREPLY_MAIL_PW,
    }
});

const sendVerificationEmail = (userEmail, verificationCode) => {
    const mailOptions = {
        from: process.env.NOREPLY_MAIL_ADDRESS,
        to: userEmail,
        subject: 'ticker app email verification',
        html: `
            <style>
                body {
                    background-color: hsl(30, 15%, 88%);
                    color: hsl(30, 25%, 12%);
                    font-size: 1.1rem;
                    line-height: 1.2;
                    margin: 0;
                    padding: 25px;
                }
                img {
                    width: 150px;
                }
            </style>
            <img src="https://fablog.eu/assets/logo_transp_bg.png" alt="openTicket logo" width="150">
            <hr>
            <h1>Welcome to open<b>Ticket</b>!</h1>
            <p>Please paste the following verification code to the open<b>Ticket</b> app within the next 15 minutes.</p>
            <h3>${verificationCode}</h3>
            <br><hr><br>
            <h1>Willkommen bei open<b>Ticket</b>!</h1>
            <p>Bitte kopiere den Prüfcode innerhalb der nächsten 15 Minuten in die open<b>Ticket</b> app.</p>
            <h3>${verificationCode}</h3>
            <br>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error occurred: ' + error.message);
        }
        console.log('Email sent: ' + info.response);
    });
};

const sendInvitationEmail = (recipientEmail, subject, body) => {
    const mailOptions = {
        from: process.env.NOREPLY_MAIL_ADDRESS,
        to: recipientEmail,
        subject,
        html: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error occurred: ' + error.message);
        }
        console.log('Email sent: ' + info.response);
    });
}

const sendResetPasswordEmail = (recipientEmail, subject, body) => {
    const mailOptions = {
        from: process.env.NOREPLY_MAIL_ADDRESS,
        to: recipientEmail,
        subject,
        html: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error occurred: ' + error.message);
        }
        console.log('Email sent: ' + info.response);
    });
}

const updateVerificationArray = (email) => {
    fs.readFile("openTicketDb/emailVerification.json", "utf8", (err, emailVerifications) => {
        if (err) {
            console.error(err);
            return;
        }
        let emailVerificationsArray = JSON.parse(emailVerifications);
        let index = emailVerificationsArray.findIndex(e => e.data.email.at(-1)[2] === email);
        emailVerificationsArray.splice(index, 1);
        fs.writeFile("openTicketDb/emailVerification.json", JSON.stringify(emailVerificationsArray), (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    })
}



const verificationTimer = (email) => {
    setTimeout(updateVerificationArray, 1800000, email);
    /* setTimeout(() => {
        fs.readFile("openTicketDb/emailVerification.json", "utf8", (err, emailVerifications) => {
            if (err) {
                console.error(err);
                return;
            }
            let emailVerificationsArray = JSON.parse(emailVerifications);
            let index = emailVerificationsArray.findIndex(e => e.data.email.at(-1)[2] === email);
            emailVerificationsArray.splice(index, 1);
            fs.writeFile("openTicketDb/emailVerification.json", JSON.stringify(emailVerificationsArray), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        });
    }, 1800000);  // 30 minutes */
}


// ######################
// ### RANDOM CYPHERS ###
// ######################

const cyphers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const randomCyphers = (length) => {
	if (!length) length = 10;
    let randomString = "";
    for (let i = 0; i < length; i++) {
        randomString += cyphers[Math.floor(Math.random() * cyphers.length)];
    }
    return randomString;
}

const randomNumbers = (length) => {
	if (!length) length = 10;
    let randomNumbers = "";
    for (let i = 0; i < length; i++) {
        randomNumbers += cyphers[Math.floor(Math.random() * 10)];
    }
    return randomNumbers;
}


// ############
// ### HASH ###
// ############

const hash = (string) => {
    let cryptoArray = [];
    let salt = randomCyphers(12);
    let saltedString = salt + string;
    let hashed = crypto.createHash('sha256').update(saltedString).digest('hex');
    cryptoArray.push(salt, hashed);
    return cryptoArray;
}

const checkHash = (salt, pepper) => {
    let saltedPepper = salt + pepper;
    return crypto.createHash('sha256').update(saltedPepper).digest('hex');
}


// ###############
// ### MONITOR ###
// ###############

let monitor = {};
let numberOfCalls = 0;

const readMonitorData = () => {
    fs.readFile("openTicketDb/monitor.json", "utf8", (err, data) => {
        if (err) {
            console.log("error reading monitor file");
            return;
        }
        monitor = JSON.parse(data);
    });
}

readMonitorData();

const updateMonitor = (key) => {
	if (!monitor[key]) monitor[key] = 0;
    monitor[key] += 1;
    if (key === "regularLogins" || key === "quickLogins") {
        monitor.totalLogins += 1;
    }
    numberOfCalls += 1;
}

const writeMonitorData = () => {
    if (numberOfCalls > 0) {
        fs.writeFile("openTicketDb/monitor.json", JSON.stringify(monitor), (err) => {
        if (err) {
            console.log("error writing monitor file");
            return;
        }
        });
        numberOfCalls = 0;
    }
    
}

setInterval(writeMonitorData, 300000);


// #########################################
// ### USERS' CACHE (IN MEMORY DATABASE) ###
// #########################################

let usersCache;
let numberOfEdits = 0;

const readUsersDb = () => {
    fs.readFile("openTicketDb/users.json", "utf8", (err, users) => {
        if (err) {
            console.error(err);
            return;
        }
        usersCache = JSON.parse(users);
    });
}

readUsersDb();

const writeUsersDb = () => {
    if (numberOfEdits > 0) {
        fs.writeFile("openTicketDb/users.json", JSON.stringify(usersCache), (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
        console.log("users.json successfully written");
        numberOfEdits = 0;
    }
}

setInterval(writeUsersDb, 180000);  // 600000



// #####  #####    #
// #   #  #   #    #
// #####  #####    #
// #   #  #        #
// #   #  #        #

app.post("/openTicket.createAccount", (request, response) => {
    const data = request.body;
    console.log(data);
    let usersArray = structuredClone(usersCache);
    if (usersArray.find((e) => e.email.at(-1)[2] === data.email.at(-1)[2])) {
        response.json({ status: "Email already exists." });
        return;
    }
    fs.readFile("openTicketDb/emailVerification.json", "utf8", (err, emailVerifications) => {
        if (err) {
            console.error(err);
            response.status(500).json({ status: "Internal Server Error" });
            return;
        }
        let password = data.password;
        hashedPassword = hash(password);
        data.password = hashedPassword;
        let emailVerificationsArray = JSON.parse(emailVerifications);
        let verificationCode = randomNumbers(6);
        sendVerificationEmail(data.email.at(-1)[2], verificationCode);
        let verificationObject = {
            date: Date.now(),
            data,
            verificationCode
        };
        emailVerificationsArray.push(verificationObject);
        fs.writeFile("openTicketDb/emailVerification.json", JSON.stringify(emailVerificationsArray), (err) => {
            if (err) {
                console.error(err);
                response.status(500).json({ status: "Internal Server Error" });
                return;
            }
            verificationTimer(data.email.at(-1)[2]);
            delete data.password;
            response.status(200).json({ status: "OK", data: data });
            updateMonitor("createdAccounts");
        });
    });
});

app.post("/openTicket.confirmEmail", (request, response) => {
    const data = request.body;
    let res = {};
    fs.readFile("openTicketDb/emailVerification.json", "utf8", (err, emailVerifications) => {
        if (err) {
            console.error(err);
            response.status(500).json({ status: "Internal Server Error" });
            return;
            }
        let emailVerificationsArray = JSON.parse(emailVerifications);
        let index = emailVerificationsArray.findIndex(e => e.data.email.at(-1)[2] === data.email);
        if (index === -1) {
            response.sendStatus(404).json({ status: "Data not found.<br>Please try again" });
            return;
        }
        
        let newUser = emailVerificationsArray[index].data;
        
        if (emailVerificationsArray[index].verificationCode != data.input) {
            response.status(401).json({ status: "Verification code is not correct" });
            return;
        }
        let newFileName = `tickets_${newUser.id}.json`;
        let newFile = [];
        let newFileString = JSON.stringify(newFile);
        fs.writeFile(`openTicketDb/${newFileName}`, newFileString, (err) => {
            if (err) {
                console.error(err);
                response.status(500).json({ status: "Internal Server Error" });
                return;
            }
            
            newUser.config = data.config;
            usersCache.push(newUser);
            numberOfEdits += 1;
            writeUsersDb();
            response.status(200).json({ status: "OK", data: newUser });
            updateMonitor("confirmEmail");
            updateVerificationArray(data.email);
        });
    });
})

app.post('/openTicket.login', (request, response) => {
    const data = request.body;
    let parsedUserData = structuredClone(usersCache);
    let index = parsedUserData.findIndex(e => e.email.at(-1)[2] === data.email);
    if (index === -1) {
        response.status(401).json({ status: "Credentials not valid" });
        return;
    }
    if (parsedUserData[index].password[1] != checkHash(parsedUserData[index].password[0], data.password)) {
        response.status(401).json({ status: "Credentials not valid" });
        return;
    }
    if (parsedUserData[index].email.at(-1)[2].toLowerCase() === data.email.toLowerCase() && parsedUserData[index].password[1]  === checkHash(parsedUserData[index].password[0], data.password)) {
        if (parsedUserData[index].config.rememberMe != data.rememberMe) {
            parsedUserData[index].config.rememberMe = data.rememberMe;
            usersCache = structuredClone(parsedUserData);
            numberOfEdits += 1;
        }
        updateMonitor("regularLogins");
        delete parsedUserData[index].password;
        response.status(200).json({ status: "OK", data: parsedUserData[index] });
    }
});

app.post('/openTicket.quickLogin', (request, response) => {
    const data = request.body;
    let parsedUserData = structuredClone(usersCache);
    let index = parsedUserData.findIndex(e => e.id === data.id);
    if (index === -1) {
        response.status(404).json({ status: "Error! Please try to log in again" });
		return;
    }
	delete parsedUserData[index].password;
	setTimeout(() => {
		response.status(200).json({ status: "OK", data: parsedUserData[index] });
		updateMonitor("quickLogins");            
	}, 5);
});

app.post('/openTicket.forgotPassword', (request, response) => {
    const data = request.body;
    let parsedUserData = structuredClone(usersCache);
    let index = parsedUserData.findIndex(e => e.email.at(-1)[2] === data.email);
    if (index === -1) {
        response.status(401).json({ status: "Error!<br>Please try again<br><br>Fehler!<br>Bitte nochmal versuchen" });
        return;
    }
    let recipient = parsedUserData[index].email.at(-1)[2];        
    let newPassword = randomCyphers(12);
    let subject = "openTicket password reset";
    let body = `
        <style>
            body {
                background-color: hsl(30, 15%, 88%);
                color: hsl(30, 25%, 12%);
                font-size: 1.1rem;
                line-height: 1.2;
                margin: 0;
                padding: 25px;
            }
            img {
                width: 150px;
            }
        </style>
        <img src="https://fablog.eu/assets/logo_transp_bg.png" alt="ticker logo" width="150">
        <h1>Password reset!</h1>
        <p>Your password has been reset. See your new password below.</p>
        <h4>${newPassword}</h4>
        <p>Please make sure to set your own password as soon as possible. You can do so in the settings menu within the app by choosing <i>'user profile'</i> and <i>'edit'</i></p>
        <br><hr><br>
        <h1>Passwort zurückgesetzt!</h1>
        <p>Dein Passwort wurde zurückgesetzt. Es lautet wie folgt:</p>
        <h4>${newPassword}</h4>
        <p>Bitte setze sobald wie möglich ein eigenes Password. Du findest die entsprechende Möglichkeit im Einstellungsmenü der App unter <i>'Nutzerprofil'</i> und dann <i>'ändern'</i></p>
        <br>
    `;

    sendResetPasswordEmail(recipient, subject, body);
    parsedUserData[index].password = hash(newPassword);
    usersCache = structuredClone(parsedUserData);
    numberOfEdits += 1;
    writeUsersDb();
    response.status(200).json({ status: "OK" });
    updateMonitor("forgotPassword");
});

/* app.post("/openTicket.getUser", (request, response) => {
    const data = request.body;
    let parsedUserData = structuredClone(usersCache);
    let index = parsedUserData.findIndex(e => e.id === data.id);
    if (index === -1) {
		response.status(500).json({ status: "server error getting user data" });
        return;
    }
    let user = parsedUserData[index];
    delete user.password;
    response.status(200).json({ status: "OK", data: user });
    updateMonitor("getUser");
}) */

app.post("/openTicket.editPersonalData", (request, response) => {
    const data = request.body;
    let parsedUserData = structuredClone(usersCache);
    let index = parsedUserData.findIndex(e => e.id === data.user.id);
    if (index === -1) {
        response.status(500).json({ status: "server error getting user data" });
        return;
    }
    if (parsedUserData.some(e => e.email.at(-1)[2] === data.user.email.at(-1)[2]) && data.user.email.at(-1)[2] != parsedUserData[index].email.at(-1)[2]) {
        response.status(401).json({ status: "No valid data<br><br>Ungültige Eingabe" });
        return;
    }
    if (data.oldPassword) {
        if (checkHash(parsedUserData[index].password[0], data.oldPassword) != parsedUserData[index].password[1]) {
            response.status(401).json({ status: "No valid data<br><br>Ungültige Eingabe" });
            return;
        }
        data.user.password = hash(data.newPassword);
    } else {
        data.user.password = parsedUserData[index].password;
    }
    parsedUserData.splice(index, 1, data.user);
    usersCache = structuredClone(parsedUserData);
    numberOfEdits += 1;
    writeUsersDb();
    delete parsedUserData[index].password;
    response.status(200).json({ status: "OK", data: parsedUserData[index], alert: "Changes were saved.<br><br>Änderungen gespeichert." });
    updateMonitor("editPersonalData");
});

app.post("/openTicket.updateUserSilent", (request, response) => {
    const data = request.body;
    let parsedUserData = structuredClone(usersCache);
    let index = parsedUserData.findIndex(e => e.id === data.id);
    if (index === -1) {
        response.status(500).json({ status: "server error getting user data" });
        return;
    }
    let passwordsArray = parsedUserData[index].password;
    data.password = passwordsArray;
    parsedUserData.splice(index, 1, data);
    usersCache = structuredClone(parsedUserData);
    numberOfEdits += 1;
    writeUsersDb();
    delete parsedUserData[index].password;
    response.status(200).json({ status: "OK", data: parsedUserData[index] });
    updateMonitor("updateUserSilent");
});

app.post("/openTicket.deleteAccount", (request, response) => {
    const data = request.body;
    let parsedUserData = structuredClone(usersCache);
    let index = parsedUserData.findIndex(e => e.id === data.id);
	if (index === -1) {
        response.status(500).json({ status: "server error getting user data" });
        return;
    }
    if (parsedUserData[index].password[1] != checkHash(parsedUserData[index].password[0], data.password)) {
        response.status(401).json({ status: "No valid data<br><br>Ungültige Eingabe" });
        return;
    }
    parsedUserData.splice(index, 1);
    usersCache = structuredClone(parsedUserData);
    numberOfEdits += 1;
    writeUsersDb();
    let fileName = `tickets_${data.id}.json`;
    fs.unlink(`openTicketDb/${fileName}`, (err) => {
        if (err) {
            console.error('Error deleting the file:', err);
            return;
        }
        console.log(`User ${data.id} has been successfully removed.`);
        response.status(200).json({ status: "OK", id: data.id });
        updateMonitor("deleteAccount");
    });
});

/* app.post("/openTicket.inviteByMail", (request, response) => {
    const data = request.body;
    let parsedUserData = structuredClone(usersCache);
    if (parsedUserData.some(e => e.email.at(-1)[2] === data.recipientEmail)) {
		response.status(200).json({ status: "email exists" });
        return;
    }
    sendInvitationEmail(data.recipientEmail, data.subject, data.body);
    response.status(200).json({ status: "OK" });
    updateMonitor("inviteByMail");
}); */

/* app.post('/openTicket.getConnectedUsers', (request, response) => {
    const id = request.body.id;
    let parsedUserData = structuredClone(usersCache);
    let index = parsedUserData.findIndex(element => element.id === id);
	if (index === -1) {
        response.status(500).json({ status: "server error getting user data" });
        return;
    }
    let currentUser = parsedUserData[index];

    let connectedUsers = [];
    currentUser.chatPartners.forEach(e => {
        let index2 = parsedUserData.findIndex(el => el.id === e);
        if (index2 === -1) return;
        let connectedUserObject = {
            id: parsedUserData[index2].id,
            firstName: parsedUserData[index2].firstName.at(-1)[2],
            lastName: parsedUserData[index2].lastName.at(-1)[2],
            userName: parsedUserData[index2].userName.at(-1)[2],
            profilePix: parsedUserData[index2].profilePix,
            about: parsedUserData[index2].about,
            hue: parsedUserData[index2].config.hue
        };
        connectedUsers.push(connectedUserObject);
    });
    response.status(200).json({ status: "OK", data: connectedUsers });
    updateMonitor("getConnectedUsers");
}); */

app.post("/openTicket.getTickets", (request, response) => {
    let data = request.body;
    let fileName = `tickets_${data.id}.json`;
    fs.readFile(`openTicketDb/${fileName}`, "utf8", (err, tickets) => {
        if (err) {
            console.error(err);
            response.status(500).json({ status: "Internal Server Error" });
            return;
        }
        let userTickets = JSON.parse(tickets);
        response.status(200).json({ status: "OK", tickets: userTickets });
    });
});

app.post("/openTicket.newTicket", (request, response) => {
    let data = request.body;
    let fileName = `tickets_${data.id}.json`;
    fs.readFile(`openTicketDb/${fileName}`, "utf8", (err, tickets) => {
        if (err) {
            console.error(err);
            response.status(500).json({ status: "Internal Server Error" });
            return;
        } 
        let ticketsArray = JSON.parse(tickets);
        ticketsArray.push(data.ticket);
        let ticketsString = JSON.stringify(ticketsArray);
        fs.writeFile(`openTicketDb/${fileName}`, ticketsString, (err) => {
            if (err) {
                console.error(err);
                response.status(500).json({ status: "Internal Server Error" });
                return;
            }
            response.status(200).json({ status: "OK", tickets: ticketsArray });
        });
    });
});

app.post("/openTicket.updateTicket", (request, response) => {
    const data = request.body;
    let fileName = `tickets_${data.userId}.json`;
    fs.readFile(`openTicketDb/${fileName}`, "utf8", (err, tickets) => {
        if (err) {
            console.error(err);
            response.status(500).json({ status: "Internal Server Error" });
            return;
        }
        let ticketsArray = JSON.parse(tickets);
        let index = ticketsArray.findIndex((e) => e.id === data.ticketId);
        ticketsArray.splice(index, 1, data.ticket);
        let ticketsString = JSON.stringify(ticketsArray);
        fs.writeFile(`openTicketDb/${fileName}`, ticketsString, (err) => {
            if (err) {
                console.error(err);
                response.status(500).json({ status: "Internal Server Error" });
                return;
            }
            response.status(200).json({ status: "OK", tickets: ticketsArray });
        });
    });
});

app.post("/openTicket.deleteOldTickets", (request, response) => {
    const data = request.body;
    let fileName = `tickets_${data.userId}.json`;
    fs.readFile(`openTicketDb/${fileName}`, "utf8", (err, tickets) => {
        if (err) {
            console.error(err);
            response.status(500).json({ error: "Internal Server Error" });
            return;
        }
        let ticketsArray = JSON.parse(tickets);
        let cleanedUpArray = ticketsArray.filter(obj => obj.prio.at(-1)[2] != -1);
        let ticketsString = JSON.stringify(cleanedUpArray);
        fs.writeFile(`openTicketDb/${fileName}`, ticketsString, (err) => {
            if (err) {
                console.error(err);
                response.status(500).json({ error: "Internal Server Error" });
                return;
            }
            response.status(200).json({ status: "OK", tickets: cleanedUpArray });
        });
    });
});


// ####################
// ### START SERVER ###
// ####################

const server = app.listen(port, () => console.log(`listening at ${port}`));
