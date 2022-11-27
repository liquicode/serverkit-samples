#=====================================================================
# Official ServerKit Docker Image
#---------------------------------------------------------------------
# - docker build --no-cache -t serverkit:latest . --file ./docker/serverkit.dockerfile
# - docker run serverkit --version
# - docker run -it -p 8080:8080 -p 8081:8081 --mount type=bind,source="%cd%",target=/server serverkit
#=====================================================================

FROM		node:14
LABEL		name="serverkit"
LABEL		description="The official docker image for ServerKit"
LABEL		library="@liquicode/serverkit"
LABEL		support="https://serverkit.net"
LABEL		version="0.0.37"

#---------------------------------------------------------------------
# Create Runtime Environment
# - Install @liquicode/serverkit
#---------------------------------------------------------------------

WORKDIR		/serverkit
RUN			npm init -y
RUN			npm install @liquicode/serverkit

#---------------------------------------------------------------------
# Mount Point for Server Folder
#---------------------------------------------------------------------

RUN			mkdir /server

#---------------------------------------------------------------------
# Environment Variables
#---------------------------------------------------------------------

ENV SERVERKIT_NAME=
ENV SERVERKIT_FOLDER=/server
ENV SERVERKIT_OPTIONS=

#---------------------------------------------------------------------
# Expose Ports
# - 8080 for Web transport
# - 8081 for WebSocket transport
#---------------------------------------------------------------------

EXPOSE 8080
EXPOSE 8081

#---------------------------------------------------------------------
# Set the Entrypoint
#---------------------------------------------------------------------

ENTRYPOINT [ "npx", "@liquicode/serverkit" ]
