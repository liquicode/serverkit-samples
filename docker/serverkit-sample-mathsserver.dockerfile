#=====================================================================
# MathsServer Sample for ServerKit
# - docker run -it -p 8080:8080 -p 8081:8081 serverkit-sample-mathsserver
#=====================================================================

FROM		agbowlin/serverkit:latest
LABEL		name="serverkit-sample-mathsserver"
LABEL		description="The MathsServer sample project for ServerKit"
LABEL		library="@liquicode/serverkit"
LABEL		support="https://serverkit.net"
LABEL		version="0.0.28"

# Copy source files
COPY ../samples/MathsServer/MathsService.js          /server/MathsService.js
COPY ../samples/MathsServer/MathsServer.options.js   /server/MathsServer.options.js

# Set Environment Variables
ENV SERVERKIT_NAME=MathsServer
ENV SERVERKIT_FOLDER=/server
ENV SERVERKIT_OPTIONS=MathsServer.options.js

# Set Entrypoint
ENTRYPOINT [ "npx", "@liquicode/serverkit", "--shell", "run" ]
