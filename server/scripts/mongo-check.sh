#!/bin/bash

SERVER_URL="http://localhost:8000/api/v1/health/mongo"

echo "Checking Mongo Health..."
STATUS_CODE=$(curl -o /dev/null -s -w "%{http_code}" $SERVER_URL)

if [ $STATUS_CODE -eq 200 ]; then
  echo -e "MongoDB is healthy! Status Code: $STATUS_CODE...✅\n"
else
  echo -e "MongoDB is down or unhealthy. Status Code: $STATUS_CODE...🔴\n"
fi