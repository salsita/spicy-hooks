if [ -z "$1" ]; then
  echo "Please provide a prerelease tag. Example:"
  echo "  publish-prerelease.sh beta"
fi

yarn lerna publish prerelease --preid "$1" --dist-tag "$1" --message "chore(prerelease): %s" --exact --no-changelog
