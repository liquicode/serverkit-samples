'use strict';

exports.Construct =
	function Construct( Server )
	{
		// Define the service.
		let service = Server.NewApplicationService(
			// Service Definition
			{
				name: 'SmallestService',
				title: 'Smallest Service',
				description: 'This is the smallest service.',
			},
			// Configuration Defaults
			{
				answer: 42,
			} );

		// Define the service function.
		service.Origins.SimpleFunction =
			Server.NewOriginDefinition(
				{
					name: 'SimpleFunction',
				},
				function () { return 'The answer is: ' + service.Settings.answer; }
			);

		// Return the service back to ServerKit.
		return service;
	};

