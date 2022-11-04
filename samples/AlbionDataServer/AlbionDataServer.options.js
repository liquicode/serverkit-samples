module.exports = {
	// defaults_filename: '~AlbionDataServer.defaults.json',
	// settings_filename: '~AlbionDataServer.settings.json',
	Settings:
	{
		AppInfo: {
			name: 'AlbionData',							// This will get overwritten anyway by the ServerKit.NewServer() function below.
			description: 'A server for viewing data from Albion Online.',
			environment: 'development',
		},
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
