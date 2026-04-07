#!/bin/bash

export LANG=en_US.UTF-8
set -e

BASE_DIR=`dirname $0`
ROOT_DIR=$BASE_DIR/..
ZIP_FILE_NAME=bahmniapps

mkdir -p $ROOT_DIR/target
rm -rf $ROOT_DIR/target/${ZIP_FILE_NAME}*.zip

yarn install --frozen-lock-file
yarn bundle
yarn uglify-and-rename

cd $ROOT_DIR

if [ "$CI" = "true" ]; then
    export MOZ_HEADLESS=1
    echo "CI mode detected, running Firefox in headless mode"
else
    if pgrep -x Xvfb >/dev/null; then
        XVFB_PID=$(pgrep -x Xvfb)
        echo "Killing Xvfb process $XVFB_PID"
        /usr/bin/sudo kill $XVFB_PID
        /usr/bin/sudo rm -rf /tmp/.X99-lock
    fi

    export DISPLAY=:99
    Xvfb :99 &
    XVFB_PID=$!
    echo "Starting Xvfb process $XVFB_PID"
fi

yarn web
cd dist && zip -r ../target/${ZIP_FILE_NAME}.zip *


if [ -n "$XVFB_PID" ]; then
    echo "Killing Xvfb process $XVFB_PID"
    /usr/bin/sudo kill $XVFB_PID
fi
