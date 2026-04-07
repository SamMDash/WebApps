#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export RUBYOPT="-r${script_dir}/ruby_compat.rb ${RUBYOPT:-}"
export NODE_OPTIONS="--require=${script_dir}/node_compat.js ${NODE_OPTIONS:-}"

# Ensure gem-installed executables (e.g. compass) are discoverable.
if command -v ruby >/dev/null 2>&1; then
	gem_bindir="$(ruby -rrubygems -e 'print Gem.bindir' 2>/dev/null || true)"
	if [[ -n "${gem_bindir}" ]]; then
		export PATH="${gem_bindir}:${PATH}"
	fi
fi

# Ensure node_modules/.bin is in PATH so local npm/yarn binaries (e.g. grunt) are found.
ui_dir="$(cd "${script_dir}/.." && pwd)"
if [[ -d "${ui_dir}/node_modules/.bin" ]]; then
	export PATH="${ui_dir}/node_modules/.bin:${PATH}"
fi

exec "$@"