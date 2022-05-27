import {Command, Flags} from '@oclif/core'
import 'dotenv/config'

export default abstract class GithubWatchAllRepos extends Command {
    static flags = {
        version: Flags.version({char: 'v'}),
        help: Flags.help({char: 'h'}),
        token: Flags.string({char: 't', description: 'Github personal access token to use.'}),
        unwatch: Flags.boolean({description: "Unwatch all repositories instead of watching them."})
    }

    static args = [{name: 'username', description: 'The username of the user/organization to watch.', required: true}]

    /**
     * Get the token from the flags or from the environment.
     * @param flags The flags object from the oclif parser.
     * @protected
     */
    protected getToken(flags: { token?: string }): string {
        if (flags.token) {
            return flags.token
        } else if (process.env.GITHUB_TOKEN) {
            return process.env.GITHUB_TOKEN
        } else {
            this.error("You must provide a personal access token with the --token flag or set the GITHUB_TOKEN environment variable.")
        }
    }

    async run() {
        const {args, flags} = await this.parse(GithubWatchAllRepos)
        const token = this.getToken(flags)
    }

    /**
     * Whether the command is running for a user or organization account. If the account is a personal user account,
     * the flag is set to `true`. If the account is an organization account, the flag is set to `false`.
     */
    static user: boolean;
}
