import  jwt ,{ decode }from "jsonwebtoken";


// wants to like a post 
// click the like button => auth middleware (next) => like controller...
const auth = async ( req, res , next) => {
// in this auth middleware having "next". that means do something and then move 2 the next

     try {
         const token = req.headers.authorization.split(" ")[1];
        //  user having specific token and here v've 2 check if his token valid
        const isCustomAuth = token.length < 500;
        // here it is our own if its > 500 then it is google 
        // vr having 2 kind of tokens 1 is from "google auth" & other have our own

        let decodedData;

        if( token && isCustomAuth){
            decodedData = jwt.verify(token, 'test')
            // from each specific token it's gng 2 give us the username
            req.userId = decodedData?.id;
            // this is how v get user's id
// here docodedData and based on that our BE is gng 2 know that our user is loggedin
        }else{
            decodedData = jwt.decode(token)
            // if ur working with google's Oauth token
            req.userId = decodedData?.sub;
            // sub is simply it's an google's id that can differentiate every single google user
        }

        next();

     } catch (error) {
         console.log(error);
     }
}

export default auth;

// click the like btn = >  auth middleware (NEXT ) => like controller.....
// if the user click the like btn
//  v dont immediately like it coz v r not sure if he has permission to like it
// 1st v go 2 through the auth middleware and it (confirms or denies) that rqst 
//  if the manual or google login is correct then to call the next()
// then it says okay to permission  