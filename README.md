# openTicket
### Way more than just a todo app

![app screenshot](https://github.com/fab-log/openTicket/blob/5fa10f0c770169fe12120c2c00348b4b5927312d/public/pix/screenshotApp.webp)

**openTicket** runs as a browser based web application. It includes user management, creating and editing tasks, adding subtasks and much more. Its innovative design displaying tasks as bubbles provides a unique look and feel. Due do a highly responsive layout it works on any screen size. Some filtering and sorting options are only available on large screens, though.

To navigate within the app, use the in app buttons only as the browser's 'back button' or similar gestures will make you leave the app. Reloading the page triggers a logout unless you checked the 'remember me' checkbox.

### Beta

Note that the application is in beta stage, bugs or errors should be expected.

## Documentation

#### Installation (local)

Prequisites: node.js needs to be installed on your device.

1. Copy or clone this repository to your machine.
2. Decompress, if necessary.
3. Store all files in an app directory of your choice.
4. In a command line terminal, navigate to your app directory.
5. Run `npm init` to initialize the project.
6. Run `npm i` to install dependencies (only *express* is required).
7. Run `node server.js` to start the application. If you prefer a developer context you can run `nodemon start` instead. In that case an installation of *nodemon* is required.
8. Open a browser window an type `localhost:8001/` to the address bar.
