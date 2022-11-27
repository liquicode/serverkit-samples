'use strict';

const ServerKit = require( '@liquicode/serverkit' );
const LIB_ASSERT = require( 'assert' );

//---------------------------------------------------------------------
describe( `Using the FileProvider storage provider directly within a service`,
	function ()
	{

		let Server = null;
		let SessionToken = null;

		//---------------------------------------------------------------------
		before(
			async function ()
			{
				// Create a ServerKit server.
				Server = ServerKit.NewServer( 'TestServer', __dirname, {
					Settings: {
						Transports: { Text: { enabled: true } },			// Enable the 'Text' transport.
						Modules: { Log: { Console: { enabled: false } } },	// Disable logging for tests.
						Services: {
							MyService: {
								MyStorage: {
									storage_provider: 'FileProvider',
									FileProvider: {
										filename_base: 'item' // Will write to files like 'item.xxxx.json'
									}
								}
							}
						}
					}
				} );
				// Initialize and start up the server.
				await Server.Initialize();
				await Server.Startup();
				return;
			}
		);

		//---------------------------------------------------------------------
		after(
			async function ()
			{
				// Remove the server's data folder.
				let path = Server.ResolveDataPath();
				Server.Liquicode.System.DeleteFolder( path, true );
				// Shut down the server.
				await Server.Shutdown();
				return;
			}
		);


		//---------------------------------------------------------------------
		it( `should Login as user`,
			async function ()
			{
				let command = `Authentication.Login --UserEmail "user@server" --Password "password"`;
				let result = await Server.Transports.Text.InvokeCommand( null, command );
				LIB_ASSERT.ok( result );
				LIB_ASSERT.ok( result.User );
				LIB_ASSERT.ok( result.User.user_id === 'user@server' );
				LIB_ASSERT.ok( result.User.user_role === 'user' );
				LIB_ASSERT.ok( result.session_token );
				SessionToken = result.session_token;
				return;
			} );


		//---------------------------------------------------------------------
		it( `should store stuff`,
			async function ()
			{
				let command = `MyService.AddStuff --Stuff 'A thing'`;
				let response = await Server.Transports.Text.InvokeCommand( SessionToken, command );
				LIB_ASSERT.ok( response );
				LIB_ASSERT.strictEqual( response, true );
				return;
			} );


		//---------------------------------------------------------------------
		it( `should get stuff`,
			async function ()
			{
				let command = `MyService.GetStuff`;
				let response = await Server.Transports.Text.InvokeCommand( SessionToken, command );
				LIB_ASSERT.ok( response );
				LIB_ASSERT.strictEqual( Array.isArray( response ), true );
				LIB_ASSERT.strictEqual( response.length, 1 );
				LIB_ASSERT.strictEqual( response[ 0 ].the_stuff, 'A thing' );
				LIB_ASSERT.strictEqual( response[ 0 ].the_answer, 42 );
				return;
			} );


	} );
