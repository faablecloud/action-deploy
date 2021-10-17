#! /bin/sh
echo "Powered by FaableCloud, starting...."
echo "Running npm command -> $NPM_RUN_COMMAND"
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
YARN_VERSION=$(yarn --version)
echo "Node:$NODE_VERSION NPM:$NPM_VERSION Yarn:$YARN_VERSION"

yarn run $NPM_RUN_COMMAND
