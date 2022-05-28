import { Command, Flags } from "@oclif/core";
import "dotenv/config";
import { RepoClient, RepoClientMode } from "./repo-client";

export default abstract class GithubWatchAllRepos extends Command {
  /**
   * Whether the command is running for a user or organization account. If the account is a personal user account,
   * the flag is set to `true`. If the account is an organization account, the flag is set to `false`.
   */
  abstract user: boolean;

  static flags = {
    version: Flags.version({ char: "v" }),
    help: Flags.help({ char: "h" }),
    token: Flags.string({
      char: "t",
      description: "Github personal access token to use.",
    }),
    unwatch: Flags.boolean({ description: "Unwatch all repositories." }),
    watch: Flags.boolean({
      description: "Watch all repositories (the default).",
    }),
    ignore: Flags.boolean({ description: "Ignore all repositories." }),
  };

  static args = [
    {
      name: "username",
      description: "The username of the user/organization to watch.",
      required: true,
    },
  ];

  /**
   * Get the token from the flags or from the environment.
   * @param flags The flags object from the oclif parser.
   * @return The token.
   * @protected
   */
  protected getToken(flags: { token?: string }): string {
    if (flags.token) {
      return flags.token;
    }

    if (process.env.GITHUB_TOKEN) {
      return process.env.GITHUB_TOKEN;
    }

    this.error(
      "You must provide a personal access token with the --token flag or set the GITHUB_TOKEN environment variable."
    );
  }

  /**
   * Get the mode and ensure there are no duplicates.
   * @param flags The flags object from the oclif parser.
   * @return The mode.
   * @protected
   */
  protected getMode(flags: {
    unwatch?: boolean;
    watch?: boolean;
    ignore?: boolean;
  }): RepoClientMode {
    let watchExists = flags.watch !== undefined;
    const unwatchExists = flags.unwatch !== undefined;
    const ignoreExists = flags.ignore !== undefined;
    if (
      [watchExists, unwatchExists, ignoreExists].filter((x) => x).length > 1
    ) {
      this.error(
        "You must only provide one of --watch, --unwatch, or --ignore."
      );
    } else if (!watchExists && !unwatchExists && !ignoreExists) {
      watchExists = true;
    }

    let mode: RepoClientMode;
    if (watchExists) {
      mode = "watch";
    } else if (unwatchExists) {
      mode = "unwatch";
    } else if (ignoreExists) {
      mode = "ignore";
    } else {
      throw new Error("Unreachable if statement.");
    }

    return mode;
  }

  async run(obj: typeof GithubWatchAllRepos = GithubWatchAllRepos) {
    const { args, flags } = await this.parse(obj);
    const token = this.getToken(flags);
    const mode = this.getMode(flags);
    const client = new RepoClient({
      isUser: this.user,
      username: args.username,
      token,
      mode,
      flags,
    });
    await client.main();
  }
}
