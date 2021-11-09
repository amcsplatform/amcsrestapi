const client = require( 'https' );

authenticate( "SQKvCseqeoKsBaGR2gRWZuAd5XyjwDtb", ( session, error ) => 
    error ? console.error( error ) : 
getAllFromSession( "/directory/customers", session, ( response, error ) => 
    error ? console.error( error ) : 
console.log( response )
) );

function authenticate( pat, callBack )
{   
    const request = 
    {
        method : 'POST',
        hostname : "rstapi-sbx-svc-core.amcsplatform.com",
        path : "/erp/api/authTokens?PrivateKey=" + pat,
    };

    var data = "";
    function onResponse( response )
    {
        response.on( 'data', chunk => data += chunk );

        response.on( 'end', () =>
        {
            if( response.statusCode != 200 ) callBack( null, Error( `Auth request status: ${response.statusCode}` ) );
            const body = JSON.parse( data );
            if( body.authResult != "ok" ) callBack( null, Error( `Auth request result: ${body.authResult}` ) );
            callBack( response.headers['set-cookie'], null );
        });
    }

    console.log( "Authenticating");
    client.request( request, onResponse ).end();
}

function getAllFromSession( endPoint, session, callBack )
{   
    const request = 
    {
        method : 'GET',
        hostname : "rstapi-sbx-svc-core.amcsplatform.com",
        path : "/erp/api/integrator/erp" + endPoint,
        headers: { 'Cookie': session }
    };

    var data = "";
    function onResponse( response )
    {
        response.on( 'data', chunk => data += chunk );

        response.on( 'end', () =>
        {
            if( response.statusCode != 200 ) callBack( null, Error( `Request status: ${response.statusCode}` ) );
            callBack( JSON.parse( data ), null );
        });
    }

    console.log( "Getting " + endPoint);
    client.request( request, onResponse ).end();
}
