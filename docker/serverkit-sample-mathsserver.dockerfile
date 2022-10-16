FROM		node:14
LABEL		name="serverkit-sample-mathsserver"
LABEL		description="The MathsServer sample project for ServerKit"
LABEL		support="https://serverkit.net"

# Copy source files
COPY		../samples				/samples

# Copy support files
COPY		./package.json		/home/serverkit/package.json
COPY		./readme.md			/home/serverkit/readme.md
COPY		./license.md		/home/serverkit/license.md
COPY		./VERSION			/home/serverkit/VERSION

# NPM Install
WORKDIR		/services
RUN			git clone https://github.com/liquicode/serverkit-samples.git .
RUN			npm install

# Expose Default Port for Web
EXPOSE 8080
# Expose Default Port for WebSocket
EXPOSE 8081

# Set the Entrypoint
# ENTRYPOINT [ "npx", "@liquicode/serverkit", "--folder", "/services/samples/MathsServer" ]

# docker build -t serverkit-sample-mathsserver:latest . --file ./docker/serverkit-sample-mathsserver.dockerfile

# docker run -it --mount type=bind,target=/serverkit-data,source=W:\code-projects\orgs\liquicode\apps\serverkit.git\~samples\MathsServer serverkit --name MathsServer --folder /data
