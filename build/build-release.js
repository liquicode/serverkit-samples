"use strict";


const LIB_FS = require( 'fs' );
const LIB_PATH = require( 'path' );

const Liquicode = require( '@liquicode/liquicodejs' );
const Builder = require( './builder-2022-09-14.js' );

const DOCKER_REGISTRY_URL = 'registry.hub.docker.com/agbowlin';

let package_folder = process.cwd();
let package_filename = LIB_PATH.join( package_folder, 'package.json' );
let PACKAGE = require( package_filename );


//=====================================================================
//=====================================================================
//
//		Build Startup
//
//=====================================================================
//=====================================================================


// Initial Heading.
Builder.LogHeading( `Build starting ...` );
Builder.LogMuted( `Running in: ${package_folder}` );


// Load the project's Package file.
Builder.LogMuted( `Loaded package.json` );
Builder.LogMuted( `  - name = ${PACKAGE.name}` );
Builder.LogMuted( `  - version = ${PACKAGE.version}` );


//=====================================================================
//=====================================================================
//
//		Build serverkit
//
//=====================================================================
//=====================================================================


function build_docker_image( Filename, ImageName, RegistryUrl, Version )
{
	let output = '';
	Liquicode.WithFileText( Filename, function ( filename, text ) { return Liquicode.ReplaceBetween( text, 'version="', '"', Version ); } );
	output = Builder.Execute( `docker build -t ${ImageName}:latest . --file ${Filename}` );
	output = Builder.Execute( `docker image tag ${ImageName}:latest ${RegistryUrl}/${ImageName}:v${Version}` );
	output = Builder.Execute( `docker image tag ${ImageName}:latest ${RegistryUrl}/${ImageName}:latest` );
	output = Builder.Execute( `docker push ${RegistryUrl}/${ImageName}:v${Version}` );
	output = Builder.Execute( `docker push ${RegistryUrl}/${ImageName}:latest` );
	return;
}

Builder.LogHeading( `Docker Build: serverkit ...` );
{
	let image_name = 'serverkit';
	let docker_filename = LIB_PATH.join( package_folder, 'docker', `${image_name}.dockerfile` );
	build_docker_image( docker_filename, image_name, DOCKER_REGISTRY_URL, PACKAGE.version );
}


Builder.LogHeading( `Docker Build: serverkit-sample-mathsserver ...` );
{
	let image_name = 'serverkit-sample-mathsserver';
	let docker_filename = LIB_PATH.join( package_folder, 'docker', `${image_name}.dockerfile` );
	build_docker_image( docker_filename, image_name, DOCKER_REGISTRY_URL, PACKAGE.version );
}


Builder.LogHeading( `Published version [${PACKAGE.version}].` );

