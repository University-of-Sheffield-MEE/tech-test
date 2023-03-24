# MEE Tech Test

This project will form the starting point of the MEE Software Engineer Tech Test.

It is a minimal remote-access experiment. It can display a live video feed of a motor, allows you to set the motor 'power', and reports the current motor speed.

During your interview you will be asked to make additions or changes to the front-end of this repository to meet some user stories.

These tasks might include:
* Adding new HTML elements
* Adding new interactivity in JS
* Making API calls
* Processing simple data

You might like to become familiar with the existing code ahead of time.

## Components of Repository

### `frontend`

The frontend directory contains a front-end for a remote-access experiment. 

It is built using normal HTML and 'vanilla' JS for fairness and simplicity. Minimal styling is applied using bootstrap css. 

Make sure you understand what is happening in `index.js`. You will not need to interact with `video-stream.js`.

### `backend`

The backend contains a Node JS backend server, which provides a RESTful API for the front-end. Some of the functionality has been mocked out for local testing. The real server you connect to in your interview will control an actual motor.

Express.js is used to serve the API.

You will not be asked to modify this; it is provided for reference and local testing.

## Running for development

### Pre-requisites

You will need a modern version of [Node JS](https://nodejs.org/en) installed on your computer

### Dependencies

With Node JS installed and available from your command line, run the following command in the root directory of this project:

```
npm install
```

All dependencies will then be installed

### Starting the server

Run the following command in the root directory of this project:

```
npm run dev
```

A server will start at `http://localhost:8080`. Open this URL and you will see a front-end. Click the connect button with all default values to enable controls.

## Any Questions

If any aspect of these instructions is unclear, please [raise an issue](https://github.com/University-of-Sheffield-MEE/tech-test/issues)