## AMCS Platform REST API

### Quick start

In this quick start walkthrough we're going to cover the basics in terms of authentication, and retrieving a resource.

For [this example](./example1.js) we're going to use Node.js and the standard https module.
You can also check out this [Postman Collection](./rstapi-sbx.postman_collection.json) for details of the calls involved.

#### Set-up

Lets set up boiler plate with an authentication that returns a session, which we pass on via a callback to a function to retrieve the customers from the /directory/customers end point.

The credentials needed to log on can be found on the developer stack forum:

https://stack.amcsplatform.com/13/how-do-i-access-the-dev-sandbox

```js
//example1.js
const client = require( 'https' );

authenticate( <<current pat here>>, ( session, error ) => 
    error ? console.error( error ) : 
getAllFromSession( "/directory/customers", session, ( response, error ) => 
    error ? console.error( error ) : 
console.log( response )
) );

function authenticate( pat, callBack )
{   
}

function getAllFromSession( endPoint, session, callBack )
{
}
```
#### Authentication
We're going to use the REST API sandbox with the latest release of Platform installed. For accessing the REST API this gives us a base URI of:

https://rstapi-sbx-svc-core.amcsplatform.com/erp/api/

We're going to authenticate via a PAT token. The authentication needs to be made as a POST request to the authTaokens end point.

```js
//example1.js > authentication
    const request = 
    {
        method : 'POST',
        hostname : "rstapi-sbx-svc-core.amcsplatform.com",
        path : "/erp/api/authTokens?PrivateKey=" + pat,
    };
```
The response contains a session token in a cookie and a json with user details for the user linked with the PAT. We'll check the authResult and then return the cookie as the session object.
```js
//example.js > authentication
    var data = "";
    function onResponse( response )
    {
        response.on( 'data', chunk => data += chunk );

        response.on( 'end', () =>
        {
            if( response.statusCode != 200 ) 
                callBack( null, Error( `Auth request status: ${response.statusCode}` ) );
            const body = JSON.parse( data );
            if( body.authResult != "ok" ) 
                callBack( null, Error( `Auth request result: ${body.authResult}` ) );
            callBack( response.headers['set-cookie'], null );
        });
    }

    console.log( "Authenticating");
    client.request( request, onResponse ).end();
```
#### Getting Customers

The base path for the data end points is a little longer.

https://rstapi-sbx-svc-core.amcsplatform.com/erp/api/integrator/erp

The session is added back in as a cookie.

```js
//example1.js > getAllFromSession
    const request = 
    {
        method : 'GET',
        hostname : "rstapi-sbx-svc-core.amcsplatform.com",
        path : "/erp/api/integrator/erp" + endPoint,
        headers: { 'Cookie': session }
    };
```
To finish it off we make the GET and parse the JSON.
```js
    var data = "";
    function onResponse( response )
    {
        response.on( 'data', chunk => data += chunk );

        response.on( 'end', () =>
        {
            if( response.statusCode != 200 ) 
                callBack( null, Error( `Request status: ${response.statusCode}` ) );
            callBack( JSON.parse( data ), null );
        });
    }

    console.log( "Getting " + endPoint);
    client.request( request, onResponse ).end();
```
Get the [full example here](./example1.js)
