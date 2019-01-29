#!/bin/bash

require_clean_work_tree () {
  git rev-parse --verify HEAD >/dev/null || exit 1
  git update-index -q --ignore-submodules --refresh

  # Disallow unstaged changes in the working tree
  if ! git diff-files --quiet --ignore-submodules
  then
    echo "There are unstaged changes."
    git diff-files --name-status -r --ignore-submodules --
    exit 1
  fi

  # Disallow uncommitted changes in the index
  if ! git diff-index --cached --quiet --ignore-submodules HEAD --
  then
    echo "The index contains uncommitted changes."
    git diff-index --cached --name-status -r --ignore-submodules HEAD --
    exit 1
  fi
}

require_clean_work_tree
