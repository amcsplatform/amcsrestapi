const client = require( 'https' );

exports.authenticate = async function( pat, callBack )
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
            if( response.statusCode != 200 )
            {
                callBack( null, Error( `Auth request status: ${response.statusCode}` ) );
            }
            else
            {
                const body = JSON.parse( data );
                if( body.authResult != "ok" )
                {
                    callBack( null, Error( `Auth request result: ${body.authResult}` ) );
                }
                else
                {
                    callBack( response.headers['set-cookie'], null );
                }
            }
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
