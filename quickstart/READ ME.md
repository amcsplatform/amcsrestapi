## AMCS Platform REST API

### Quick start

In this quick start walkthrough we're going to cover the basics in terms of authentication, and retrieving a resource.

For [this example](./example1.js) we're going to use Node.js with the standard https module.
We're going to provide a couple of examples using async/await and Promises.

You can also check out this [Postman Collection](./rstapi-sbx.postman_collection.json) for details of the calls involved.

#### Set-up

Lets set up boiler plate with an authentication that returns a session, which we pass on to retrieve the customers from the /directory/customers end point.

The credentials needed to log on can be found on the developer stack forum:

https://stack.amcsplatform.com/13/how-do-i-access-the-dev-sandbox

```js
//example1.js
const client = require( 'https' );

example1 = async () =>
    {
        console.log( "\nWith async/await\n" );
        await asyncExample();

        console.log( "\nWith promises\n" );
        promiseExample();
    }

example1();
```
For the Promise example we'll need a couple of Promises. Once to do the authentication and a second to get the first page of customers.
```js
promiseToStartSession = ( pat ) => //( session )
    new Promise( ( resolve, reject ) => {} );

promiseToGetAllFromSession = ( endPoint, session ) => //( resources )
    new Promise( ( resolve, reject ) => {} );

promiseExample = () =>
    promiseToStartSession( "SQKvCseqeoKsBaGR2gRWZuAd5XyjwDtb" )
    .then( ( session ) => 
        promiseToGetAllFromSession( "/directory/customers", session ) )
    .then( ( resources ) => console.log( resources ) )
    .catch( ( error ) => console.error( error ) );
```
And then we can use those as the basis of a couple of async functions for the async/await example.
```js
startSession = async ( pat ) => 
    promiseToStartSession( pat );
    
getAllFromSession = async ( endPoint, session ) =>
    promiseToGetAllFromSession( endPoint, session );

asyncExample = async () =>
{
    try
    {
        session = await startSession( "SQKvCseqeoKsBaGR2gRWZuAd5XyjwDtb" );
        resources = await getAllFromSession( "/directory/customers", session );
        console.log( resources );
    }
    catch( error )
    {
        console.error( error );
    }
}
```

#### Authentication
We're going to use the REST API sandbox with the latest release of Platform installed. For accessing the REST API this gives us a base URI of:

https://rstapi-sbx-svc-core.amcsplatform.com/erp/api/

We're going to authenticate via a PAT token. The authentication needs to be made as a POST request to the authTokens end point.

```js
//example1.js > promiseToStartSession
    const request = 
    {
        method : 'POST',
        hostname : "rstapi-sbx-svc-core.amcsplatform.com",
        path : "/erp/api/authTokens?PrivateKey=" + pat,
    };
```
The response contains a session token in a cookie and a json with user details for the user linked with the PAT. We'll check the authResult and then return the cookie as the session object.
```js
//example.js > promiseToStartSession
    var data = "";
    onResponse = ( response ) =>
    {
        response.on( 'data', chunk => data += chunk );

        response.on( 'end', () =>
        {
            if( response.statusCode != 200 ) 
                reject( `Auth request status: ${response.statusCode}` );
            else if( JSON.parse( data ).authResult != "ok" ) 
                reject( `Auth request result: unAuthorised` );
            else resolve( response.headers['set-cookie'] );
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
//example1.js > promsieToGetAllFromSession
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
//example1.js > promsieToGetAllFromSession
    var data = "";
    onResponse = ( response ) =>
    {
        response.on( 'data', chunk => data += chunk );

        response.on( 'end', () =>
        {
            if( response.statusCode != 200 ) 
                reject( `Request status: ${response.statusCode}` );
            else resolve( JSON.parse( data ) );
        });
    }

    console.log( "Getting " + endPoint);
    client.request( request, onResponse ).end();
```
Get the [full example here](./example1.js)
