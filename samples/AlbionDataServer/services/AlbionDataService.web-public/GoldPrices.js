'use strict';


app.controller(
	'GoldPrices_Controller',
	function ( $scope, $http, $window, $location, $cookies )
	{

		//---------------------------------------------------------------------
		// Define the Page Context
		var Page = {
			User: window.SERVER_DATA.User,
			Chart: null,
			StartDate: '',
			EndDate: '',
		};
		$scope.Page = Page;
		{
			let time = new Date();
			time.setFullYear( time.getFullYear() - 1 ); // 1 Year Ago
			Page.StartDate = `${time.getUTCMonth() + 1}-${time.getUTCDate()}-${time.getFullYear()}`;

			time = new Date();
			time.setDate( time.getDate() + 2 ); // 2 Days in the Future
			Page.EndDate = `${time.getMonth() + 1}-${time.getDate()}-${time.getFullYear()}`;
		}


		//---------------------------------------------------------------------
		// Reload the data and reconstruct the chart.
		Page.ReloadChart =
			function ()
			{
				if ( Page.Chart )
				{
					Page.Chart = null;
				}
				// WebSocket.AlbionDataService.GetGoldPrices( 1000,
				WebSocket.AlbionDataService.GetGoldPricesRange(
					Page.StartDate, Page.EndDate,
					( error, result ) =>
					{
						if ( result.ok === true )
						{

							// Get the prices from the server.
							let prices = [];
							prices.push( `Time,Price` );
							// - Load in chronological order.
							for ( let index = ( result.result.length - 1 ); index >= 0; index-- )
							{
								let item = result.result[ index ];
								prices.push( `${item.timestamp},${item.price}` );
							}

							// Chart the data.
							Page.Chart = new Dygraph(
								document.getElementById( 'GoldPricesChart' ),
								prices.join( '\n' ),
								{ // https://dygraphs.com/options.html
									// Value display/formatting
									labelsUTC: true,
									// Interactive Elements
									animatedZooms: true,
									// Legend
									hideOverlayOnMouseOut: false,
									labelsDiv: document.getElementById( 'GoldPricesChartLegend' ),
									labelsSeparateLines: false,
									legend: 'always',
								}
							);

							$scope.$apply();
						}
						else if ( result.ok === false )
						{
							alert( result.error );
						}
						else if ( error )
						{
							alert( error );
						}
						return;
					} );
			};


		//---------------------------------------------------------------------
		// Initialize View
		Page.ReloadChart();


		//---------------------------------------------------------------------
		// Exit Controller
		return;
	} );
