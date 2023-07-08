#!/bin/sh

while true; do
    echo "Installing all necessary modules..."
    npm i
    echo "Starting bot..."
    npm start
    echo "Bot died, restarting in 5 seconds..."
    sleep 5
done
