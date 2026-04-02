#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export RUBYOPT="-r${script_dir}/ruby_compat.rb ${RUBYOPT:-}"
export NODE_OPTIONS="--require=${script_dir}/node_compat.js ${NODE_OPTIONS:-}"

exec "$@"