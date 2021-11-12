const client = require( 'https' );

var hostToAccess = "";

// Promises ------------------------------------------------

module.exports.promiseToStartSession = ( host, pat ) => //( session )
    new Promise( ( resolve, reject ) =>
    {   
        hostToAccess = host;
        
        const request = 
        {
            method : 'POST',
            hostname : hostToAccess,
            path : "/erp/api/authTokens?PrivateKey=" + pat,
        };

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
    } );

module.exports.promiseToGetAllFromSession = ( endPoint, session ) => //( resources )
    new Promise( ( resolve, reject ) =>
    { 
        const request = 
        {
            method : 'GET',
            hostname : hostToAccess,
            path : "/erp/api/integrator/erp" + endPoint,
            headers: { 'Cookie': session }
        };

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
    } );

// Asyn functions ------------------------------------------

module.exports.startSession = async ( host, pat ) => this.promiseToStartSession( host, pat );
module.exports.getAllFromSession = async ( endPoint, session ) => this.promiseToGetAllFromSession( endPoint, session );
