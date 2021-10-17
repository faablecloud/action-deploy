FROM node:15.11.0
LABEL com.faable.cloud="FaableCloud"
LABEL version="1.0"
LABEL description="Faablecloud automatic deployment"


WORKDIR /faable/app

# Copy entrypoint script
COPY ./entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh


# Arguments for building
ARG arg_NPM_BUILD_COMMAND=build
ARG arg_NPM_RUN_COMMAND=start
ARG arg_NODE_ENV=production


# Environment variables for runtime
ENV PORT=80
ENV NPM_BUILD_COMMAND=$arg_NPM_BUILD_COMMAND
ENV NPM_RUN_COMMAND=$arg_NPM_RUN_COMMAND
ENV NODE_ENV=$arg_NODE_ENV


# Copy Usercode
COPY ./ /faable/app

# Install dependencies
# RUN yarn install --production=false --frozen-lockfile

# Build the project if requested
RUN echo "Running build command: $NPM_BUILD_COMMAND"
RUN yarn run $NPM_BUILD_COMMAND


ENTRYPOINT ["/bin/sh", "/faable/app/entrypoint.sh"]  
