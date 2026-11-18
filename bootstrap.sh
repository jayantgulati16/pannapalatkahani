#!/bin/sh
# Panna Palat studio — set up a fresh cloud session (≈10–15 min the first time).
# Run from the studio clone:  sh /home/claude/studio/bootstrap.sh
set -e
STUDIO=$(cd "$(dirname "$0")" && pwd)
LIB=/home/claude/ext/lemo-opuscar
mkdir -p /home/claude/ext /home/claude/tools /home/claude/outputs
[ -f "$LIB/AGENTS.md" ] || git clone -q --depth 1 https://github.com/lemomo-ai/lemo-opuscar.git "$LIB"
cd "$LIB"
sh plugin/skills/lemo-opuscar/scripts/setup.sh deps music
for l in freepats vcsl vsco2ce; do [ -d "core/audio/instruments/$l" ] || sh tools/fetch.sh instruments "$l"; done
# the studio's films (template episode, comic maker, dp, STUDIO.md, LOG.md) go into the library's films/ folder
mkdir -p films && cp -r "$STUDIO"/films/* films/
cp "$STUDIO"/tools/* /home/claude/tools/
echo "studio ready: $LIB/films (read films/STUDIO.md)"
