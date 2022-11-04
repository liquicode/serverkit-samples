module.exports = {
	Settings:
	{
		AppInfo: {
			name: 'Scrapesheet',
			description: 'Scrape and store html tables.',
			environment: 'development',
		},
		Services: {
			Services: {
				Authentication: {
					SessionStorage: {
						storage_engine: 'Database',
					},
				},
				ServerAccounts: {
					UserStorage: {
						storage_provider: 'Sqlite3Provider',
						Sqlite3Provider: {
							filename: 'ServerAccounts.sqlite3',				// Name of the database file.
							table_name: 'ServerAccount',					// Name of the table for this service.
						},
					},
				},
				Sheets: {
					UserStorage: {
						storage_provider: 'Sqlite3Provider',
						Sqlite3Provider: {
							filename: 'Sheets.sqlite3',				// Name of the database file.
							table_name: 'Sheets',					// Name of the table for this service.
						},
					},
				},
			},
		},
		Transports: {
			Web: {
				enabled: true,
				ClientSupport: {
					enabled: true,
					// view_core: 'w3css-angularjs',				// Generate core ui elements (in public_folder).
					// view_core_overwrite: true,					// Overwrite existing files when copying the view core.
				},
			},
			WebSocket: {
				enabled: true,
				ClientSupport: {
					enabled: true,
				},
			},
		},
	},
};
