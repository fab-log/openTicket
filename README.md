# openTicket
### Way more than just a todo app

![app screenshot](https://github.com/fab-log/openTicket/blob/5fa10f0c770169fe12120c2c00348b4b5927312d/public/pix/screenshotApp.webp)

**openTicket** runs as a browser based web application. It includes user management, creating and editing tasks, adding subtasks and much more. Its innovative design displaying tasks as bubbles provides a unique look and feel. Due do a highly responsive layout it works on any screen size. Some filtering and sorting options are only available on large screens, though.

To navigate within the app, use the in app buttons only as the browser's 'back button' or similar gestures will make you leave the app. Reloading the page triggers a logout unless you checked the 'remember me' checkbox.

### Beta

Note that the application is in beta stage, bugs or errors should be expected.

# Documentation

## Installation (local)

Prequisites: node.js needs to be installed on your device.

1. Copy or clone this repository to your machine.
2. Decompress, if necessary.
3. Store all files in an app directory of your choice.
4. In a command line terminal, navigate to your app directory.
5. Run `npm init` to initialize the project.
6. Run `npm i` to install dependencies (only *express* is required).
7. Run `node server.js` to start the application. If you prefer a developer context you can run `nodemon start` instead. In that case an installation of *nodemon* is required.
8. Open a browser window an type `localhost:8001/` to the address bar.

___

## API

The API uses the *json* middleware. Most of the transmitted data is provided as an object including a status and a data key.
Common expected errors are handled specifically, further errors are passed on from the server to the client and displayed in the console as well as to the user (timed pop up information).

___

### api.createAccount

POST
```
data = {
        id,
        firstName,
        lastName,
        email,
        password
    }
```

Response:\
status, userdata (except password) of the newly created user

___

### api.login

POST
```
data = {
        email,
        password
    }
```

Response:\
status, userdata (except password) with matching email

___

### api.quickLogin

Applies if a user has checked the checkbox for *remember me on this device* and if the ID is stored in the browser's localStorage.

POST
```
data = {
        id
    }
```

Response:\
status, userdata (except password) with matching id

___

### api.editPersonalData

POST
```
data = {
        id
    }
```

Response:\
status, updated userdata (except password) with matching id

___

### api.deleteAccount

POST
```
data = {
        id
    }
```

Response:\
status

___

### api.getTickets

POST
```
data = {
        id
    }
```

Response:\
status, array of tickets (=tasks) associated with the sent user id

___

### api.newTicket

Used for creating a new task.

POST
```
data = {
        id,
        ticket
    }
```

Response:\
status, updated array of tickets (=tasks) associated with the sent user id, including the new ticket

___

### api.updateTicket

Used to aplly changes to an existing task.

POST
```
data = {
        id,
        ticket
    }
```

Response:\
status, updated array of tickets (=tasks) associated with the sent user id, including the modified ticket

___

### api.deleteOldTickets

Used to permanently remove tasks that have been marked as completed.

POST
```
data = {
        id
    }
```

Response:\
status, updated array of tickets (=tasks) associated with the sent user id, cleared of any tasks with a current status of *-1* (='done')

___
