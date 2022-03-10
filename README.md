# TOPIC: Middleware2

## Authentication with JWT
- Token generation
- Token verification

## Assignment
- For this assignment you have to create a new branch - assignment/auth-2
- Your user document should look like this
```
 	{
    "_id" : ObjectId("6226e3d2b98f22b349ca58be"),
    "firstName" : "Sabiha",
    "lastName" : "Khan",
    "mobile" : "9898909087",
    "emailId" : "sk@gmail.com",
    "password" : "password123",
    "gender" : "female",
	"isDeleted": false, //default value is false 
    "age" : 12,
    "createdAt" : ISODate("2022-03-08T05:04:18.737Z"),
    "updatedAt" : ISODate("2022-03-08T05:04:18.737Z"),
    "__v" : 0
}
```


- Write a POST api /users to register a user from the user details in request body. 
- Write a POST api /login to login a user that takes user details like email and password from the request body. If the credentials don't match with any user's data return a suitable error.
On successful login, generate a JWT token and return it in response body.
- Write a GET api /users/<userId> to fetch user details. Pass the userId as path param in the url. Check that request must contain **x-auth-token** header. If absent, return a suitable error.
If present, check that the token is valid.
- Write a PUT api /users/<userId> to update user details. Pass the userId as path param in the url and update the attributes received in the request body. Check that request must contain x-auth-token header. If absent, return a suitable error.
- Write a DELETE api /users/<userId> that takes the userId in the path params and marks the isDeleted attribute for a user as true. Check that request must contain x-auth-token header. If absent, return a suitable error.
- Once, all the apis are working fine, move the authentication related code in a middleware called auth.js
- Add this middleware at route level in the routes where applicable.

-+ Please note that you have to also write the logic for authorisation so that a logged in user can only modify or fetch their own data.

	
	
# TRY CATCH SUMMARY:
// if you get an error in try block, it will not execute the next lines of code inside try
// instead it will jump into catch block and execute the code there
// code in catch block is normallly not executed
//rather catch block is only executed if there is error in try block
// the error( along with message++) gets sent to catch block incase there is an error




# Specific HTTP codes(only impt ones)
// 2xx- Success
// 4xx- something gone wrong..and problem is on user side(client side)
// 5xx- server side problems

// "BAD REQUEST" ...400..say if username password dont match etc..or anything generic( any problem in input on user side or any other unhandled problem)
// "RESOURCE NOT FOUND"...404 //404 page not found...eg. find ("asaijndianud89")...let book =bookModel.findOne({_id:"asaijndianud89"})   if (book){..} else res.status(404).send({})
// "AUTHENTICATION MISSING"...401..login is required...if(token){...} else { res.status(401)}
// "NOT AUTHENTICATED OR FORBIDDEN"..403 // if ( token.userId === userId) {...} else {res.status(403).send({}) }
// -- try catch ....// "SERVER ERROR"...500

// -- ALL GOOD... //status(200)- OK
// --- "ALL GOOD and A NEW RESOURCE WAS SUCCEFULLY CREATED" ...status(201)..e.g a new user registers herself successfully


