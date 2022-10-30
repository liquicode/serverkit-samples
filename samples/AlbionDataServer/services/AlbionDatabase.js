'use strict';


const LIB_FS = require( 'fs' );
const LIB_PATH = require( 'path' );

const LIB_BETTER_SQLITE3 = require( 'better-sqlite3' );


exports.NewAlbionDatabase =
	function NewAlbionDatabase( Server )
	{
		let database = {


			//---------------------------------------------------------------------
			Filename: '',
			Database: null,
			Procedures: {},


			//---------------------------------------------------------------------
			startup:
				function startup( SqliteFilename )
				{
					// Connect to the database.
					let database_options = {};
					LIB_FS.mkdirSync( LIB_PATH.dirname( SqliteFilename ), { recursive: true } );
					this.Filename = SqliteFilename;
					this.Database = LIB_BETTER_SQLITE3( this.Filename, database_options );

					// Initialize the database.
					let init_sql = `
						CREATE TABLE IF NOT EXISTS Gold (
						timestamp TEXT PRIMARY KEY,
						price INTEGER );`;
					let create_table_info = this.Database.exec( init_sql );

					{ // SQL: insert
						let sql = 'INSERT OR REPLACE INTO Gold ( timestamp, price ) VALUES ( @timestamp, @price );';
						this.Procedures.insert = this.Database.prepare( sql );
					}

					{ // SQL: select last
						let sql = 'SELECT timestamp, price FROM Gold ORDER BY timestamp DESC LIMIT @count;';
						this.Procedures.select_last = this.Database.prepare( sql );
					}

					{ // SQL: select range
						let sql = 'SELECT timestamp, price FROM Gold WHERE (timestamp >= @start_time) AND (timestamp <= @end_time) ORDER BY timestamp DESC;';
						this.Procedures.select_range = this.Database.prepare( sql );
					}

					return;
				},


			//---------------------------------------------------------------------
			shutdown:
				function shutdown()
				{
					if ( this.Database )
					{
						this.Database.close();
						this.Database = null;
					}
					this.Procesdures = {};
					return;
				},


			//---------------------------------------------------------------------
			insert_row:
				function insert_row( Timestamp, Price )
				{
					let insert_info = this.Procedures.insert.run( { timestamp: Timestamp, price: Price } );
					if ( !insert_info.changes ) { throw new Error( `Error insering row in database.` ); }
					return;
				},


			//---------------------------------------------------------------------
			get_last_rows:
				function get_last_rows( Count )
				{
					let last = this.Procedures.select_last.all( { count: Count } );
					return last;
				},


			//---------------------------------------------------------------------
			get_timerange_rows:
				function get_timerange_rows( StartTime, EndTime )
				{
					let range = this.Procedures.select_range.all( { start_time: StartTime, end_time: EndTime } );
					return range;
				},


			//---------------------------------------------------------------------
			async_refresh_data:
				async function async_refresh_data()
				{
					let rows_added = 0;
					let last = this.Procedures.select_last.get( { count: 1 } );
					if ( !last )
					{
						last = { timestamp: '2000-01-01T00:00:00', price: 0 };
					}

					let from_date = '';
					{
						let time = new Date( last.timestamp );
						from_date = `${time.getUTCMonth() + 1}-${time.getUTCDate()}-${time.getUTCFullYear()}`;
					}

					let to_date = '';
					{
						let time = new Date();
						time.setUTCDate( time.getUTCDate() + 2 );
						to_date = `${time.getUTCMonth() + 1}-${time.getUTCDate()}-${time.getUTCFullYear()}`;
					}

					let url = `https://www.albion-online-data.com/api/v2/stats/gold?date=${from_date}&end_date=${to_date}`;
					let result = await Server.Liquicode.Network.AsyncGetRequest( url );
					let rows = JSON.parse( result );
					for ( let index = 0; index < rows.length; index++ )
					{
						let row = {
							timestamp: rows[ index ].timestamp,
							price: rows[ index ].price,
						};
						let insert_info = this.Procedures.insert.run( row );
						rows_added += insert_info.changes;
					}

					return rows_added;
				},


		};
		return database;
	};