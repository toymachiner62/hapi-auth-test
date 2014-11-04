hapi-auth-test
==============

Creating a simple test case to reproduce a bug i'm encountering

# Usage

To reproduce the error "[Cannot display object: Converting circular structure to JSON]":

1. Clone this project
2. `$ npm install`
3. `$ npm start`
4. Hit `http://localhost:3000/items` in a browser
5. The error is visible in the server log
