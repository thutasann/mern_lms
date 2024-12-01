#!/bin/bash

REQUIRED_VERSION="20.5.1"

echo "Checking Node.js version..."
CURRENT_VERSION=$(node -v)

if [ "$CURRENT_VERSION" == "v$REQUIRED_VERSION" ]; then
  echo "Node.js version is correct: $CURRENT_VERSION"
else
  echo "Warning: Expected Node.js v$REQUIRED_VERSION but found $CURRENT_VERSION"
fi