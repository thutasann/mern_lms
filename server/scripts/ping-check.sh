#!/bin/bash

SERVER_URL="http://localhost:8000/api/v1/health/ping"

echo "Checking Mongo Ping Health..."
STATUS_CODE=$(curl -o /dev/null -s -w "%{http_code}" $SERVER_URL)

if [ $STATUS_CODE -eq 200 ]; then
  echo -e "Ping Check is success! Status Code: $STATUS_CODE...✅\n"
else
  echo -e "Ping Check is failed. Status Code: $STATUS_CODE...🔴\n"
fi