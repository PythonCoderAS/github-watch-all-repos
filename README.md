# github-watch-all-repos

Watch all repositories belonging to an individual user/organization.

## Quickstart

```shell
npm install -g github-watch-all-repos
GITHUB_TOKEN="<your-github-token>" github-watch-all-repos user <userToWatch>
# Alternatively: GITHUB_TOKEN="<your-github-token>" github-watch-all-repos organization <orgToWatch>
```

## Features

### Tokens

Tokens need to be github private access tokens with the `repo` and `notifications` scopes. If you do not want to follow
any private repos, then the `public_repo` scope and `notifications` sufficies.

Tokens can either be given via the `--token` argument or via the `GITHUB_TOKEN` environment variable. Alternatively,
a `.env` file with `GITHUB_TOKEN=<token>` can also be created; see [dotenv](https://github.com/motdotla/dotenv) for more
information.

### User/Organization

There is one command for watching users and one command for watching organizations. A user cannot be supplied to the
organization command or vice versa, otherwise an NotFoundError will occur.

#### User Mode: Collaborators

User mode contains an additional configuration option, `--collaborator` that works when the supplied user is the same
user that created the token the client is using. Specifiyng this option will cause the client to watch all repositories
that the user is a collaborator on.

### Modes

The client can operate in one of three modes:

- `--watch`: Watch all repositories belonging to the user/organization. This is the default operation.
- `--unwatch`: Unwatch all repositories belonging to the user/organization.
- `--ignore`: Ignore all repositories belonging to the user/organization.

The mode can be specified as a command line flag. Only one mode may be specified at a time.

### Private Repos

Private repositories are included by default. In order to exclude them from the watch list, the `--no-private` option
can be supplied.
