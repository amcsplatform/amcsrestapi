const client = require( 'https' );

// Promises ------------------------------------------------

module.exports.promiseToRequest = ( request ) =>
    new Promise( ( resolve, reject ) =>
    {
        var data = "";
        onResponse = ( response ) =>
        {
            if( response.statusCode != 200 ) 
                reject( `Auth request status: ${response.statusCode}` );

            response.on( 'data', chunk => data += chunk );
            response.on( 'end', () => resolve( JSON.parse( data ) ) );
        }

        console.log( "Authenticating");
        client.request( request, onResponse ).end();
    } );

module.exports.promiseToStartSession = ( host, pat ) => //( session )
    new Promise( ( resolve, reject ) =>
    {   
        const request = 
        {
            method : 'POST',
            hostname : host,
            path : "/erp/api/authTokens?PrivateKey=" + pat,
        };

        this.promiseToRequest( request )
            .then( ( data ) =>
            {
                if( data.authResult != "ok" ) 
                    reject( `Auth request result: unAuthorised` );
                else resolve(
                    {
                        cookie : response.headers['set-cookie'],
                        hostToAccess : host,
                        authAt : DateTime.Now()
                    } );
            } )
            .catch( ( e ) => reject( e ) );
    } );

module.exports.getAllRequest = ( endPoint, session ) =>
    {
        return {
            method : 'GET',
            hostname : session.hostToAccess,
            path : "/erp/api/integrator/erp" + endPoint,
            headers: { 'Cookie': session.cookie }
        };
    }

// Asyn functions ------------------------------------------

module.exports.startSession = async ( host, pat ) => this.promiseToStartSession( host, pat );
module.exports.getAllFromSession = async ( endPoint, session ) => this.promiseToRequest( getAllRequest( endPoint, session ) );
