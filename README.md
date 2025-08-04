![app screenshot](https://github.com/fab-log/openTicket/blob/5fa10f0c770169fe12120c2c00348b4b5927312d/public/pix/logo_transp_bg.webp)

### Way more than just a todo app

-----------

![app screenshot](https://github.com/fab-log/openTicket/blob/5fa10f0c770169fe12120c2c00348b4b5927312d/public/pix/screenshotApp.webp)

**openTicket** runs as a browser based web application. It includes user management, creating and editing tasks, checklists, and notes. Its innovative design displaying tasks as bubbles combined with intelligent sorting provides a unique look and feel. Due do a highly responsive layout it works on any screen size. Some filtering and sorting options are only available on large screens, though.

### Features

- Tasks
- Checklists
- Notes
- Table or bubble mode
- Customisable due date, priority, and color
- Elements can be converted, e.g. a task can be converted into a checklist
- Intelligent sorting based on priority an due date
- Filtering and sorting options (in table mode)
- Integrated search
- UI available in English and German
- Dark and light mode

### Beta

Note that the application is in beta stage, bugs or errors should be expected.

# Documentation

## Installation (local)

Prerequisites: **node.js** needs to be installed on your device.

1. Copy or clone this repository to your machine.
2. Decompress, if necessary.
3. Store all files in an app directory of your choice.
4. In a command line terminal, navigate to your app directory.
5. Run `npm init` to initialize the project.
6. Run `npm i` to install dependencies (only *express* is required).
7. Run `node server.js` to start the application. If you prefer a developer context you can run `nodemon start` instead. In that case an installation of *nodemon* is required.
8. Open a browser window an type `localhost:8005/` to the address bar.

___

## API

The API uses the *json* middleware. Most of the transmitted data is provided as an object including a *status* and a *data* key.
Common expected errors are handled specifically, further errors are passed on from the server to the client and displayed in the console as well as to the user (timed pop up information).

___

### openTicket.createAccount

POST
```Javascript
data = {
        id,
        firstName,
        lastName,
        email,
        password,
        config: {
                mode,
                listType,
                language,
                rememberMe
        }
    }
```

Response:\
status, userdata (except password) of the newly created user

___

### openTicket.login

POST
```Javascript
data = {
        email,
        password
    }
```

Response:\
status, userdata (except password) with matching email

___

### openTicket.quickLogin

Applies if a user has checked the checkbox for *remember me on this device* and if the ID is stored in the browser's localStorage.

POST
```Javascript
data = {
        id
    }
```

Response:\
status, userdata (except password) with matching id

___

### openTicket.updateUserSilent

POST
```Javascript
data = {
        id,
        firstName,
        lastName,
        email,
        config: {
                mode,
                listType,
                language,
                rememberMe
        }
    }
```

Response:\
status, updated userdata (except password) with matching id

___

### openTicket.editPersonalData

POST
```Javascript
data = {
        id,
        firstName,
        lastName,
        email,
        config: {
                mode,
                listType,
                language,
                rememberMe
        }
    }
```

Response:\
status, updated userdata (except password) with matching id

___

### openTicket.forgotPassword

POST
```Javascript
data = {
        email
    }
```

Response:\
status

___

### openTicket.deleteAccount

POST
```Javascript
data = {
        id
    }
```

Response:\
status

___

### openTicket.getTickets

POST
```Javascript
data = {
        id
    }
```

Response:\
status, array of tickets (=tasks) associated with the sent user id

___

### openTicket.newTicket

Used for creating a new task.

POST
```Javascript
data = {
        id,
        ticket
    }
```

Response:\
status, updated array of tickets (=tasks) associated with the sent user id, including the new ticket

___

### openTicket.updateTicket

Used to aplly changes to an existing task.

POST
```Javascript
data = {
        id,
        ticket
    }
```

Response:\
status, updated array of tickets (=tasks) associated with the sent user id, including the modified ticket

___

### openTicket.deleteOldTickets

Used to permanently remove tasks that have been marked as completed.

POST
```Javascript
data = {
        id
    }
```

Response:\
status, updated array of tickets (=tasks) associated with the sent user id, cleared of any tasks with a current status of *-1* (='done')

___

## Database

The database consits of a data collection for the user data (user.json) and one collection for each user containing the associated tasks. The naming for these files follows this scheme:\
`tickets_user_` `a javascript timestamp` `_` `ten random characters` `.json`\
Example: `tickets_user_1725820680651_Dj4N4PRfXX.json`

To read and write data from/to the collections the (asynchronous) node.js **fs module** is used.

Every single data set (except ids) contains all historic information. To achive this and to be able to entirely rebuild a former state, each data set has a defined structure.

```Javascript
{
        property: [
                [timestamp, editor, value]
        ]
}
```

Example

```Javascript
{
        firstName: [
                [1725820680651, user_1725820680651_Dj4N4PRfXX, "John"]
        ]
}
```

In case a property changes an additional array `[timestamp, editor, value]` is pushed to the property array conserving all former data as well as the time and the author of the modification. The current value is always to be found in the last array. For example
```Javascript
{
        firstName: [
                [1725820680651, user_1725820680651_Dj4N4PRfXX, "John"],
                [1725820689876, user_1725820680651_Dj4N4PRfXX, "Johnny"]
        ]
}
```
will print *'Johnny'* as first name.

