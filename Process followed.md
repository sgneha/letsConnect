##### Why Mongo Atlas

you cant install a local instance of mongo when you are using heroku,you have to see something like digital ocean if you want to install mongo on the server.

Mongoose is a package with npm which allows to use model our data and it gives bunch of methods to interract with db like find,remove.

Start our express server:

##### make package.json (npm init) :put name,description,main→server.js,author.

Install regular dependencies: npm i (below all)

* express⇒ its web framework for back end

* express-validator⇒for data validator so that when we make post req to our api and if there needs to be field that are not there then it will raise an error

* bcryptjs⇒password encryption

* config⇒for global variables

* gravatar⇒ profile picture avatars. If a user sign ups with the email associated with the gravatar account it will automatically show the profile image

* jsonwebtoken⇒ will use jwt to pass token for validation

* mongoose⇒layer that sit on top of db so that we can interact with it.

* request⇒small module that allows to make http request to another api and we are installing this for github repositories,we want our profiles to have github repositories listed on them.We will be making backend request and hide our api keys just return the repositories.

##### Install dev dependencies: npm i -D(nodemon concurrently)

* nodemon⇒constantly watch server so we don't have to refresh server everytime we make change.

* concurrently⇒allow us to run our backend express server and frontend react server at the same time with one single command.

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

```
"scripts": {
// this script heruko will run when we deploy (2nd part server is name of the file)
    "start": "node server",   
 // for development script server(2nd part server is name of the file)   
    "server": "nodemon server" 
  },
```

Later we will add client script which run react and dev script which will run both at the same time using concurrently package installed.

Now we can check in postman or in the browser as its simple get request that our express server is up and running .

### Connect db

copy the string from atlas after hitting connect

- create a folder in root config-inside it

  1. create file default.json and put that copied string in json with your password(mongodb atlas password)

  2. create another file db.js for connection⇒ this connection can also be done inside server.js but better not to do clutter that file.

For connection we can use `mongoose.connect(db)` which will return promise with .then .catch but through out the course we will be using async await as it is new standard and much cleaner. (it makes your code look synchronous even though it is asynchronous)

- bring in mongoose
- bring config package
- get the value mongoURI in the variable db. By config.get we can get any value from json file
- async arrow function to connect
- connection wrap up in try catch block so that if it does not connects then we can show error
- await mongoose.connect(db); // as this returns a promise so we put await here
- exit process with failure
- export connectDB

- Now call connectDB() in server.js
- now its connected but gives warning :
- (node:3373) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.
  MongoDB connected...
- warning gone after adding these two

    useNewUrlParser: true,

    useUnifiedTopology: true,

#### Route Files with express router



- will have separate file for diff route.we can do normally in servert.js but it is large application,will have separate routes.
- create folder in root called routes. All route will be returning json for our API.There will no server rendering templates,all gonna happen on front end react application.With Api folder create all files.
  • In each file:
- Bring in express router in each file to use routes in different files
- to use express router create var router.
- to test make public get request.

• Now we want to access these routes so in server.js will define routes
• check on postman it works

#### Section 3: User API Routes & JWT Authentication

• Users => In order to interact with our db we need to create model for each of our resources.
create models folder-> file with upper case convention.
•putting avatar in model schema of user so that when user is created avatar is available right away.Because making profile is later stage. gravatar attaches picture with your email.
All other things will be in profile.

• Route that will register users and setup express validator for clean response

•will make post req in users.js
•we used to install body parser as separate package but now it comes with express.
•//Init Middleware
 //doing this line in server.js will allow data in req.body
  ```app.use(express.json({ extended: false })); ```//pass object

    •Postman: post request
      •header->key:content type,value:application/json
      •body->raw
      it works

• Bring in check ,validationResult->(check in the documentation)
• we can pass second argument to post route as check (pass a feild,msg)then dot rule.
• To handle the respone go to the actual body and set errors.
• Now again check in postman it gives error if validation fails and if request is proper it gives proper response.It works.

##### Put Some logic in user registration(3.11)

•Destructure and pull out from req.body

•Bring model to users.js and label the function the req,res function as async.

• try

1. See if the user exits then send error

   • find user by email and check if it exits then send status 400 & send error matching the previous types of error.

2. get users gravatar(based on email),we want that part of user
   • Bring in gravatar package.

   • s=> default size,r=> no bad pics, m=> default pic if does not have gravatar

   • create instance of user and pass the object(name,email,avatar,password)

3. encryt the password

   • Bring in Bcrypt

   • create a salt to do the hashing

   • take user password and hash it

   • save the user

   Note : anything that returns promise make sure to put await in front.

   • just send and check in postman "user registered".And check in mongodb atlas the created user.

4. return the jsonwebtoken(this is because when in the front end user logs in ,if he has webtoken and it gets logged in right away)

   • return jsonwebtoken once they register so that they can use that token to authenticate and access protected routes.

   • first we sign in and pass the payload then we have callback to send response to the client.

   • later we have to protect our routes by creating a middleware so that it verifies the token.

5. Bring in jsonwebtoken as jwt
6. create a payload which is a object having a user in which it has id (this id is what we get when promise is returned from user.save().mongoose provide a abstraction layer so that we can use id instead if _id which is created from database.
7. put inside config/default.json make jwtSecret => put anything(now have to require config also)
8. In jwt sign put payload,this above token and optional expiring(before deploying in production change this to less time),callback(possible error,token).If we do not get error then in response we can send anything token or id back to the client.In this case we are sending the token.

   • catch

#### Custom Auth Middleware & JWT verify

• Now we need to send that token back to authenticate so that to can access protected route.That will be done by creating custom middleware.

• create folder middleware and file auth.js

• Bring config and jwt

• export this middleware function. As it is middleware function it takes three (req,res,next).Middleware function has access to req res cycle objects and next is callback which takes move forward to next middleware.

• When we send a req in protected route we send it in header.

• check if no token 401 status

• if token is there decode it by verify which takes two things(first token from header,jwtSecret)

• set req object user by decoding(we attached user id in payload ). And now use that user further in any protected route.

• next() as in every middleware

catch

• it will run when token is not valid

##### Let's implement the above in protected route

• Bring middleware.

• whenever we use middleware ,we add second param,just doing this makes the route protected.

• if we check in postman get request auth we get "No token authorization denied" means its protected. If we want to access it and get the response then copy the token of that registered user,and go to the route -header-key->x-auth-token and value as copied token.Now we get the response.That means middleware is doing its job and validating the token.

• We want userid as response.Bring user model.we will do try catch so that make call to db.Return the user (req.user from middleware)minus the password.

• Now in postman we do get call auth with token we get response user data.Save this postman as get auth user

##### user authentication and login

• We do a post request to login a user who has registered already.If any of the email is not in the db or password does not matches gives invalid credentials.
• we do a post req with correct credentials token is generated and use this token in postman to GET auth user and it gives back that particular user.
• save Post as Login user.

#### Profile API Routes

###### Creating profile model

• Model for our profile just like User
• Reference to User model because we profile associated with user
• if currently working there is 'true' then will disable the field 'to' .Will do this thing in react.
• 'social' is an object list of objects to other social media links.

###### Get current user profile

• In route/profile we have to make lot of routes first lets create GET to get our(based on userid in the token) profile then route (Post) to create a profile.
• Bring in model Profile and User
• Use middleware auth as its protected route will need token
• we need to populate name and user also so will user populate method(first arg is name of the model from where to populate,array of feilds that has to be populated)
• hitting url get ``` http://localhost:5000/api/profile/me``` now gives response 'no token ' and with login user token it gives msg 'no profile'
• Next Will create route for creation of profile

##### Create & update profile one route

• As we need to use auth middleware and validation so will put brackets as second paramater(auth,checks)
• If post req in postman it requires token  
• grab the token from 'get logged in users profile' and check post call.Nothing happens because have not send any response yet.
• pull out and destructure
• If we don't define `profileFields.social = {};`it will give can't find youtube of undefined(social)
• now update and insert data(if profile is found it will update it and if not will create it)
• for education and experience will create diff routes and end points

##### Get all profiles

• Its public so no auth required.Get all profiles with name and avatar so populate
• Logged in with 2nd user and created profile for that user and checked in route for all profiles in postman.It shows both.

##### Get profile of a user by user id

• Colon in route as it is placeholder.
• do profiles to profile as it is single profile
• id will come from params
• if user id is given something which is not the kind then also it should give error 'profile not found' not 'Server Error'. So add this

```if (err.kind == "ObjectId") {
     return res.status(400).json({ msg: "Profile not found" });
   }
```

##### One route to Delete profile and user

• As it is private we have access to the token and get the user
• add auth
• later will use this route to delete user post

##### Add profile experience

• PUT request to update the experience(could be POST too)
• need to have validation because in front end react will have some form to add the experience.
• In front end will take date and format with package momentjs so that it looks nice.
• we have not done updation of experience ,if want do that later.

##### Delete profile experience

• we need exp_id to delete
• There are many ways to get the remove index.we are doing one of it

##### Add & Delete profile Education

• same as above

#### Post API routes

##### creating post model 5.24

##### Add Post routes

• we will be getting name and the avatar from the user id from the token.So that has not been send as post request
• we can now create post from any user

##### Route to get all post,get post by id and delete post.

We want the same error to show when we send valid format ID but the wrong one and when we send ID which is not even in valid format.

##### Adding and removing likes

    • check if post has not liked by this user already
    • filter is high order array method
    • likes is an array
    • filter takes a function
    • compare the current iteration with the user who is loggedin
    • 'req.user.id' is in string format
    • only returns spmething when it matches

    • removing likes check if its been liked or not then unlike it and returm all the likes of the post

##### Adding and removing comments

    • put id of the post
    • create a new comment
    • new comment is just an object,we are not making a collection

    • To delete a comment we need both post id and the comment id
