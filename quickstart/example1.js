const client = require( 'https' );

//----------------------------------------------------------

promiseToStartSession = ( pat ) => //( session )
    new Promise( ( resolve, reject ) =>
    {   
        const request = 
        {
            method : 'POST',
            hostname : "rstapi-sbx-svc-core.amcsplatform.com",
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

promiseToGetAllFromSession = ( endPoint, session ) => //( resources )
    new Promise( ( resolve, reject ) =>
    { 
        const request = 
        {
            method : 'GET',
            hostname : "rstapi-sbx-svc-core.amcsplatform.com",
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

promiseExample = () =>
    promiseToStartSession( "SQKvCseqeoKsBaGR2gRWZuAd5XyjwDtb" )
    .then( ( session ) => 
        promiseToGetAllFromSession( "/directory/customers", session ) )
    .then( ( resources ) => console.log( resources ) )
    .catch( ( error ) => console.error( error ) );

//----------------------------------------------------------

startSession = async ( pat ) => promiseToStartSession( pat );
getAllFromSession = async ( endPoint, session ) => promiseToGetAllFromSession( endPoint, session );

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

//----------------------------------------------------------

example1 = async () =>
    {
        console.log( "\nWith async/await\n" );
        await asyncExample();

        console.log( "\nWith promises\n" );
        promiseExample();
    }

example1();

//----------------------------------------------------------

pm.test("response is ok.", () => {
    pm.response.to.have.status(200);
  });
  
pm.test('Check if changes links are exists in response of Routes.', function() {
    var jsonData = pm.response.json();
      if (jsonData.resource != undefined) { 
          pm.expect(jsonData).to.have.property('extra');
          if (jsonData.extra.hasOwnProperty('cursor') === true) {
              pm.expect(jsonData.extra).to.have.property('cursor');
          }    
          else {
              pm.expect(jsonData.extra).to.have.property('until');
          }
          pm.expect(jsonData).to.have.property('links');
          pm.expect(jsonData.links).to.have.property('next');
      }
      else {
          pm.expect.fail("Changes links was not present in response for GET Routes.")
      }
  });
