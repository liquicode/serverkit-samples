
# serverkit-samples
***Samples and examples for the `@liquicode/serverkit` library.***


Samples
---------------------------------------------------------------------

- [TestConfig](docs/samples/TestConfig.md):
	- A simple project that demonstrates some aspects of server configuration and basic operation.

- [SmallestService](docs/samples/SmallestService.md):
	- Demonstrates a minimal service which exposes a single Origin.

- [MathsServer](docs/samples/MathsServer.md):
	- Implements a simple `MathsService` to do maths.
	- Exposes four maths Origins: Add, Subtract, Multiply, Divide.
	- Uses a ViewCore to generate a functional website for `MathsServer`.

- [AlbionDataServer](docs/samples/AlbionDataServer.md):
	- Caches data from https://www.albion-online-data.com into a local database.
	- Exposes Origins to retrieve data from cache.
	- Displays a chart of the data using a View.
	- Implements a scheduled Task to refresh the cache every 20 minutes.

- [Scrapesheet](docs/samples/Scrapesheet.md):
	- Currently a work in progress!
	- A server to scrape data from html tables.
	- Uses the `Amqp` transport and message queues to control long running processes.


ServerKit Links
---------------------------------------------------------------------

- [ServerKit Source Code](https://github.com/liquicode/serverkit)
- [ServerKit Docs Site](http://wiki.serverkit.net)
- [ServerKit NPM Page](https://www.npmjs.com/package/@liquicode/serverkit)

