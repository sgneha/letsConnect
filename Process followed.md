Why Mongo Atlas

you cant install a local instance of mongo when you are using heroku,you have to see something like digital ocean if you want to install mongo on the server.

Mongoose is a package with npm which allows to use model our data and it gives bunch of methods to interract with db like find,remove.

Start our express server:

make package.json (npm init) :put name,description,main→server.js,author.

Install regular dependencies: npm i (below all)

express⇒ its web framework for back end

express-validator⇒for data validator so that when we make post req to our api and if there needs to be field that are not there then it will raise an error

bcryptjs⇒password encryption

config⇒for global variables

gravatar⇒ profile picture avatars. If a user sign ups with the email associated with the gravatar account it will automatically show the profile image

jsonwebtoken⇒ will use jwt to pass token for validation

mongoose⇒layer that sit on top of db so that we can interact with it.

request⇒small module that allows to make http request to another api and we are installing this for github repositories,we want our profiles to have github repositories listed on them.We will be making backend request and hide our api keys just return the repositories.

Install dev dependencies: npm i -D(nodemon concurrently)

nodemon⇒constantly watch server so we don't have to refresh server everytime we make change.

concurrently⇒allow us to run our backend express server and frontend react server at the same time with one single command.

server.js

just get a very simple express server up and running.

```jsx
const express = require("express");
```

Initialise app variable with express

```jsx
const app = express();
```

put port in an variable,this below will look for an env variable called PORT to use when we deploy in heroku or locally [localhost](http://localhost) we will run on 5000.Means if no env variable set it will go to default 5000

```jsx
const PORT = process.env.PORT || 5000;
```

listen on an PORT with app variable, will pass the port,we can do callback if we want something to happen when it connect

```jsx
app.listen(PORT, () => console.log(Server started on port ${PORT}));
```

now we create single end point just to test, want a simple get request with callback with( req, res).And just send data to browser

```jsx
app.get("/", (req, res) => res.send("API Running"));
```

Now we can run this with

```bash
node server.js
```

but will make some change in the npm scripts in package .json

will replace 'test' to 'start' and add 'server'

```json
"scripts": {
    "start": "node server",   // this script heruko will run when we deploy (2nd part server is name of the file)
    "server": "nodemon server" // for development script server(2nd part server is name of the file)
  },
```

Later we will add client script which run react and dev script which will run both at the same time using concurrently package installed.

Now we can check in postman or in the browser as its simple get request that our express server is up and running .

### Connect db

copy the string from atlas after hitting connect

- create a folder config-inside it

  1. create file default.json and put that copied string in json with your password.⇒


      2. create another file db.js for connection⇒ this connection can also be done inside server.js but better not to do clutter that file.

For connection we can use `mongoose.connect(db)` which will return promise with .then .catch but through out the course we will be using async await as it is new standard and much [cleaner.](http://cleaner.It) (it makes your code synchronous even though it is asynchronous)

- bring in mongoose
- bring config package
- get the value mongoURI in the variable db. By config.get we can get any value from json file
- async arrow function to connect
- connection wrap up in try catch block so that if it does not connects then we can show error
- await mongoose.connect(db); // as this returns a promise so we put await here
- exit process with failure

- Now call connectDB() in server.js
- now its connected but gives warming :
- (node:3373) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.
  MongoDB connected...
- warning gone after adding these two

useNewUrlParser: true,

useUnifiedTopology: true,

#### Route Files with express router

- will have separate file for diff route.
- create folder in root called routes. All route will be returning json for our API.There will no server rendering templates,all gonna happen on front end react application.With Api folder create all files.
  • In each file:
- Bring in express router
- to use express router create var router.
- to test make publec get request.

• Now we want to access these routes so in server.js will define routes
• check on postman it works

#### Section 3: User API Routes & JWT Authentication

• Users => In order to interact with our db we need to create model for each of our resources.
create models folder-> file with upper case convention.
•putting avatar in model schema of user so that when user is created avatar is available right away.Becuase making profile is later stage. gravatar attaches picture with your email.
All other things will be in profile.
