'use strict';
// my-service.js

const ServerKit = require( '@liquicode/serverkit' );

exports.Construct =
	function Construct( Server )
	{

		//---------------------------------------------------------------------
		// Define the service.
		let service = Server.NewApplicationService(
			// Service Definition
			{ name: 'MyService', title: 'My Service' },
			// Service Configuration Defaults
			{}
		);

		service.Storage = null;

		//---------------------------------------------------------------------
		// Called when the server starts up.
		service.StartupModule =
			async function StartupModule()
			{
				// Register this file with the Source Watcher.
				// <<<<<<<<========   NOTICE   ========>>>>>>>>
				Server.SourceWatcher.RegisterSource( __filename );
				return;
			};

		//---------------------------------------------------------------------
		// Return the service back to ServerKit.
		return service;
	};

