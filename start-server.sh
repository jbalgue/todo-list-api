#!/bin/bash

# THIS IS FOR DEMO PURPOSES ONLY - DO NOT PLACE SENSITIVE CREDENTIALS.
# Configs should be stored and provided by an external services and accessed thru the app
# eg. AWS Secrets Manager, GCP Secret Manager etc.
# 
# Note: Server should be restarted for every config change

DIR=$(cd $(dirname $0); pwd);

export LOG_LEVEL=trace
export SERVER_PORT=3000
export DATABASE_HOST=mongodb://localhost
export DATABASE_PORT=27017
export DATABASE_NAME=todo_master

echo "$" nodemon -r esm server.js
         nodemon -r esm server.js
