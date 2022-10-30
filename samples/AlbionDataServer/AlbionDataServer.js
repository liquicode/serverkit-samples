'use strict';

// Load the ServerKit Library and Options.
const ServerKit = require( '@liquicode/serverkit' );

// Load the Server Options.
const ServerOptions = require( './AlbionDataServer.options.js' );

// Create a new server for this folder.
const Server = ServerKit.NewServer( 'AlbionDataServer', __dirname, ServerOptions );

// Run the server.
( async function ()
{
	Server.InstallAutoShutdown();
	await Server.Initialize();
	await Server.Startup();
} )();

