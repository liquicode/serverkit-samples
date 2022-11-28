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
			{
				crontab: '*/5 * * * *' // Every 5 seconds
			}
		);

		service.Storage = null;

		//---------------------------------------------------------------------
		// Called when the server starts up.
		service.StartupModule =
			async function StartupModule()
			{
				// Register this file with the Source Watcher.
				// <<<<<<<<========   NOTICE   ========>>>>>>>>
				Server.TaskManager.AddTask(
					'MyService.SillyMessage',
					{
						crontab: service.Settings.crontab,
					},
					async function invoke()
					{
						Server.Log.info( 'Hello World!' );
						return;
					},
				);
				return;
			};

		//---------------------------------------------------------------------
		// Return the service back to ServerKit.
		return service;
	};

