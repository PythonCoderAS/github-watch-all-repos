# github-watch-all-repos
Watch all repositories belonging to an individual user/organization.

# Usage

<!-- usage -->
```sh-session
$ npm install -g github-watch-all-repos
$ github-watch-all-repos COMMAND
running command...
$ github-watch-all-repos (--version)
github-watch-all-repos/1.0.0 darwin-x64 node-v18.2.0
$ github-watch-all-repos --help [COMMAND]
USAGE
  $ github-watch-all-repos COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`github-watch-all-repos help [COMMAND]`](#github-watch-all-repos-help-command)
* [`github-watch-all-repos organization USERNAME`](#github-watch-all-repos-organization-username)
* [`github-watch-all-repos user USERNAME`](#github-watch-all-repos-user-username)

## `github-watch-all-repos help [COMMAND]`

Display help for github-watch-all-repos.

```
USAGE
  $ github-watch-all-repos help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for github-watch-all-repos.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `github-watch-all-repos organization USERNAME`

Watch all repositories under an organization.

```
USAGE
  $ github-watch-all-repos organization [USERNAME] [-v] [-h] [-t <value>] [--unwatch]

ARGUMENTS
  USERNAME  The username of the organization to watch.

FLAGS
  -h, --help           Show CLI help.
  -t, --token=<value>  Github personal access token to use.
  -v, --version        Show CLI version.
  --unwatch            Unwatch all repositories instead of watching them.

DESCRIPTION
  Watch all repositories under an organization.
```

_See code: [dist/commands/organization.ts](https://github.com/PythonCoderAS/github-watch-all-repos/blob/v1.0.0/dist/commands/organization.ts)_

## `github-watch-all-repos user USERNAME`

Watch all repositories under a personal user account.

```
USAGE
  $ github-watch-all-repos user [USERNAME] [-v] [-h] [-t <value>] [--unwatch]

ARGUMENTS
  USERNAME  The username of the user to watch.

FLAGS
  -h, --help           Show CLI help.
  -t, --token=<value>  Github personal access token to use.
  -v, --version        Show CLI version.
  --unwatch            Unwatch all repositories instead of watching them.

DESCRIPTION
  Watch all repositories under a personal user account.
```

_See code: [dist/commands/user.test.ts](https://github.com/PythonCoderAS/github-watch-all-repos/blob/v1.0.0/dist/commands/user.ts)_
<!-- commandsstop -->
