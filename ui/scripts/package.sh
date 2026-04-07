#!/bin/bash

export LANG=en_US.UTF-8
set -e

BASE_DIR=`dirname $0`
ROOT_DIR=$BASE_DIR/..
ZIP_FILE_NAME=bahmniapps

ensure_compass() {
    if command -v compass >/dev/null 2>&1; then
        return 0
    fi

    echo "Compass not found. Installing compass gem..."
    if gem install compass --no-document; then
        return 0
    fi

    echo "Global gem install failed, retrying with --user-install"
    gem install compass --no-document --user-install
    USER_GEM_BIN="$(ruby -rrubygems -e 'print Gem.user_dir' 2>/dev/null)/bin"
    export PATH="$USER_GEM_BIN:$PATH"

    if ! command -v compass >/dev/null 2>&1; then
        echo "Failed to install compass. Please ensure RubyGems is available and retry."
        exit 1
    fi
}

ensure_compass

mkdir -p $ROOT_DIR/target
rm -rf $ROOT_DIR/target/${ZIP_FILE_NAME}*.zip

yarn install --frozen-lock-file
yarn bundle
yarn uglify-and-rename

cd $ROOT_DIR

if [ "$CI" = "true" ]; then
    echo "CI mode: skipping UI karma tests in package step and running web preprocess only"
    bash ./scripts/with-ruby-compat.sh grunt preprocess:web
else
    if command -v Xvfb >/dev/null 2>&1; then
        if pgrep -x Xvfb >/dev/null; then
            XVFB_PID=$(pgrep -x Xvfb)
            echo "Killing Xvfb process $XVFB_PID"
            /usr/bin/sudo kill $XVFB_PID
            /usr/bin/sudo rm -rf /tmp/.X99-lock
        fi

        export DISPLAY=:99
        Xvfb :99 -screen 0 1920x1080x24 -nolisten tcp &
        XVFB_PID=$!
        echo "Starting Xvfb process $XVFB_PID"
        export KARMA_BROWSER=Firefox
    else
        echo "Xvfb not found. Falling back to FirefoxHeadless."
        export MOZ_HEADLESS=1
        export KARMA_BROWSER=FirefoxHeadless
    fi

    yarn web
fi
cd dist && zip -r ../target/${ZIP_FILE_NAME}.zip *


if [ -n "$XVFB_PID" ]; then
    echo "Killing Xvfb process $XVFB_PID"
    /usr/bin/sudo kill $XVFB_PID
fi
