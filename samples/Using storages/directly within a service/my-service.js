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
				answer: 42,
				// <<<<<<<<========   NOTICE   ========>>>>>>>>
				MyStorage: Server.StorageDefaults(),
			} );

		service.Storage = null;

		//---------------------------------------------------------------------
		// Called when the server starts up.
		service.StartupModule =
			async function StartupModule()
			{
				// Instantiate a storage based on the configured settings.
				// <<<<<<<<========   NOTICE   ========>>>>>>>>
				service.Storage = Server.NewStorage( service, service.Settings.MyStorage );
				return;
			};

		//---------------------------------------------------------------------
		// Define the AddStuff function.
		service.Origins.AddStuff =
			Server.NewOriginDefinition(
				{
					name: 'AddStuff',
					Fields: [
						Server.NewFieldDefinition( { name: 'Stuff', type: 'string' } ),
					],
				},
				async function ( User, Stuff )
				{
					// Add a new data object to the storage, include the answer just for fun.
					// <<<<<<<<========   NOTICE   ========>>>>>>>>
					let result = await service.Storage.CreateOne( { the_stuff: Stuff, the_answer: service.Settings.answer } );
					return true;
				}
			);

		//---------------------------------------------------------------------
		// Define the GetStuff function.
		service.Origins.GetStuff =
			Server.NewOriginDefinition(
				{
					name: 'GetStuff',
				},
				async function ( User )
				{
					// Get all the stuff as an array of objects.
					// <<<<<<<<========   NOTICE   ========>>>>>>>>
					let result = await service.Storage.FindMany( {} );
					return result;
				}
			);

		//---------------------------------------------------------------------
		// Return the service back to ServerKit.
		return service;
	};

