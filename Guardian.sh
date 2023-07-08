#!/bin/sh

echo "Installing the necessary modules"
npm i

while true; do
    echo "Starting bot..."
    npm start
    echo "Bot died, restarting in 5 seconds..."
    sleep 5
done
