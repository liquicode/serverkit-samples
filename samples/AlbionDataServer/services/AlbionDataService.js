'use strict';


const ALBION_DATABASE = require( './AlbionDatabase.js' );


//---------------------------------------------------------------------
exports.Construct =
	function Construct( Server )
	{
		// Create the application service.
		let service = Server.NewApplicationService(
			// Service Definition
			{
				name: 'AlbionDataService',
				title: 'Albion Data Service',
			},
			// Configuration Defaults
			{
				enabled: true,
				database_name: '~server-data/AlbionDataService.sqlite3',
				database_refresh_cron: '*/20 * * * *', // see https://crontab.guru for help
			} );

		let AlbionDatabase = ALBION_DATABASE.NewAlbionDatabase( Server );


		//---------------------------------------------------------------------
		//---------------------------------------------------------------------
		//	Service Lifecycle
		//---------------------------------------------------------------------
		//---------------------------------------------------------------------


		{

			//---------------------------------------------------------------------
			service.InitializeModule =
				function InitializeModule()
				{
					return;
				};



			//---------------------------------------------------------------------
			service.StartupModule =
				async function StartupModule()
				{
					// Connect to the database.
					let filename = Server.ResolveApplicationPath( service.Settings.database_name );
					AlbionDatabase.startup( filename );

					// Do an initial refresh to get the latest data.
					Server.Log.trace( `Refreshing data in AlbionDatabase. This may take a few moments.` );
					await AlbionDatabase.async_refresh_data();

					// Schedule a database refresh every 20 minutes.
					if ( service.Settings.database_refresh_cron )
					{
						Server.TaskManager.ScheduleTask(
							'AlbionDataService.RefreshAlbionDatabase',
							service.Settings.database_refresh_cron,
							async function invoke()
							{
								await AlbionDatabase.async_refresh_data();
								return;
							},
						);
					}

					return;
				};



			//---------------------------------------------------------------------
			service.ShutdownModule =
				function ShutdownModule()
				{
					// Shut down the database.
					AlbionDatabase.shutdown();
					return;
				};

		}


		//---------------------------------------------------------------------
		//---------------------------------------------------------------------
		//	Origin Definitions
		//---------------------------------------------------------------------
		//---------------------------------------------------------------------


		{

			//---------------------------------------------------------------------
			service.Origins.GetGoldPrices =
				Server.NewOriginDefinition(
					// Origin Definition
					{
						name: 'GetGoldPrices',
						description: "Returns a number of recent gold prices.",
						requires_login: false,
						allowed_roles: [ '*' ],
						Fields: [
							Server.NewFieldDefinition( {
								name: 'Count',
								title: "Count",
								description: "The number of values to return.",
								type: 'number',
								format: 'integer',
								default: 1,
								example: 100,
								required: false,
							} ),
						],
					},
					// Origin Function
					async function GetGoldPrices( User, Count )
					{
						Count = Count || 1;
						let prices = AlbionDatabase.get_last_rows( Count );
						if ( !prices ) { prices = []; }
						return prices;
					},
				);

			//---------------------------------------------------------------------
			service.Origins.GetGoldPricesRange =
				Server.NewOriginDefinition(
					// Origin Definition
					{
						name: 'GetGoldPricesRange',
						description: "Returns a range (timespan) of gold prices.",
						requires_login: false,
						allowed_roles: [ '*' ],
						Fields: [
							Server.NewFieldDefinition( {
								name: 'FromDate',
								title: "FromDate",
								description: "The starting date of values to return.",
								type: 'string',
								default: '4-1-2019',
								example: '4-1-2019',
								required: false,
							} ),
							Server.NewFieldDefinition( {
								name: 'ToDate',
								title: "ToDate",
								description: "The ending date of values to return.",
								type: 'string',
								default: '',
								example: '10-1-2022',
								required: false,
							} ),
						],
					},
					// Origin Function
					async function GetGoldPricesRange( User, FromDate, ToDate )
					{
						FromDate = FromDate || '';
						{
							let time = new Date( FromDate );
							FromDate = time.toISOString().substring( 0, 10 ) + 'T00:00:00';
						}
						ToDate = ToDate || '';
						{
							let time = new Date( ToDate );
							ToDate = time.toISOString().substring( 0, 10 ) + 'T23:00:00';
						}
						let prices = AlbionDatabase.get_timerange_rows( FromDate, ToDate );
						if ( !prices ) { prices = []; }
						return prices;
					},
				);

		}


		//---------------------------------------------------------------------
		//---------------------------------------------------------------------
		//	View Definitions
		//---------------------------------------------------------------------
		//---------------------------------------------------------------------


		{

			//---------------------------------------------------------------------
			service.Views.GoldPrices =
				Server.NewOriginDefinition( {
					name: 'GoldPrices',
					description: 'Show recent gold prices.',
					requires_login: false,
					allowed_roles: [ '*' ],
				} );

		}


		//---------------------------------------------------------------------
		// Return the Service.
		//---------------------------------------------------------------------


		return service;
	};

