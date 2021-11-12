const amcs = require( './amcsClient.js');

asyncExample = async () =>
    {
        try
        {
            session = await amcs.startSession( "rstapi-sbx-svc-core.amcsplatform.com", "SQKvCseqeoKsBaGR2gRWZuAd5XyjwDtb" );
            resources = await amcs.getAllFromSession( "/directory/customers", session );
            console.log( resources );
        }
        catch( error )
        {
            console.error( error );
        }
    }

promiseExample = () =>
    amcs.promiseToStartSession( "rstapi-sbx-svc-core.amcsplatform.com", "SQKvCseqeoKsBaGR2gRWZuAd5XyjwDtb" )
    .then( ( session ) => 
        amcs.promiseToGetAllFromSession( "/directory/customers", session ) )
    .then( ( resources ) => console.log( resources ) )
    .catch( ( error ) => console.error( error ) );

example1 = async () =>
    {
        console.log( "\nWith async/await\n" );
        await asyncExample();

        console.log( "\nWith promises\n" );
        promiseExample();
    }

example1();