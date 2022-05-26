import {Command, Flags} from '@oclif/core'

export default class GithubWatchAllRepos extends Command {
  static description = 'Watch all repositories belonging to an individual user/organization.'

  static flags = {
    // add --version flag to show CLI version
    version: Flags.version({char: 'v'}),
    help: Flags.help({char: 'h'}),
    user: Flags.boolean({char: 'u', description: 'Username represents an user.', default: false}),
    organization: Flags.boolean({char: 'o', description: 'Username represents an organization.', default: false}),
  }

  static args = [{name: 'username', description: 'The username of the user/organization to watch.', required: true}]

  async run() {
    const {args, flags} = await this.parse(GithubWatchAllRepos)

    if (flags.user == flags.organization){
      this.error('You must only specify one of --user/--organization.')
    }
  }
}

GithubWatchAllRepos.run()
