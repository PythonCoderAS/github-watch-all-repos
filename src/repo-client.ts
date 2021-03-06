import { Octokit } from "@octokit/rest";
import GithubWatchAllRepos from "./base";

export type RepoClientMode = "watch" | "unwatch" | "ignore";

/**
 * Parameters to pass to {@link RepoClient}.
 */
export interface RepoClientConstructorOptions {
  username: string;
  token: string;
  isUser: boolean;
  mode: RepoClientMode;
  /**
   * Direct pass-through since these flags are specific to user/organization mode
   */
  flags?: { collaborator?: boolean; [key: string]: any }; // We need [key: string]: any to stop TS errors.
  command: GithubWatchAllRepos;
  private: boolean;
}

/**
 * An interface for expected return data from Octokit repository listing methods.
 */
export interface RepoData {
  name: string;
  owner: { login: string };
  private: boolean;
}

/**
 * A class to make it easier to work with the octokit library. This stores the username and token for future use.
 */
export class RepoClient {
  username: string;
  octokit: Octokit;
  isUser: boolean;
  mode: RepoClientMode;
  collaborator: boolean;
  command: GithubWatchAllRepos;
  privateRepos: boolean;

  constructor(params: RepoClientConstructorOptions) {
    this.username = params.username;
    this.octokit = new Octokit({
      auth: params.token,
      userAgent: "github-watch-all-repos",
    });
    this.isUser = params.isUser;
    this.mode = params.mode;
    this.collaborator = params.flags?.collaborator ?? false;
    this.command = params.command;
    this.privateRepos = params.private;
  }

  /**
   * Get a list of repositories for the user/org.
   * We only care about the name and owner attributes so there's no point in specifying any other properties.
   * @returns A list of repositories.
   */
  async getRepos(): Promise<RepoData[]> {
    if (this.isUser) {
      return this.octokit.paginate(this.octokit.repos.listForUser, {
        username: this.username,
        // eslint-disable-next-line camelcase -- Octokit API
        per_page: 100,
        type: this.collaborator ? "all" : "owner",
      });
    }

    return this.octokit.paginate(this.octokit.repos.listForOrg, {
      org: this.username,
      // eslint-disable-next-line camelcase -- Octokit API
      per_page: 100,
      type: "all",
    });
  }

  async watchRepo(repo: RepoData): Promise<void> {
    await this.octokit.activity.setRepoSubscription({
      owner: repo.owner.login,
      repo: repo.name,
      subscribed: true,
    });
  }

  async unwatchRepo(repo: RepoData): Promise<void> {
    await this.octokit.activity.setRepoSubscription({
      owner: repo.owner.login,
      repo: repo.name,
      subscribed: false,
      ignored: false,
    });
  }

  async ignoreRepo(repo: RepoData): Promise<void> {
    await this.octokit.activity.setRepoSubscription({
      owner: repo.owner.login,
      repo: repo.name,
      ignored: true,
    });
  }

  private getActionVerb(): string {
    switch (this.mode) {
      case "watch":
        return "Watching";
      case "unwatch":
        return "Unwatching";
      case "ignore":
        return "Ignoring";
    }
  }

  async main(): Promise<void> {
    let repos: RepoData[] = await this.getRepos();

    if (!this.privateRepos) {
      repos = repos.filter((repo) => !repo.private);
    }

    console.log(
      `${this.getActionVerb()} ${
        repos.length
      } repositories. This may take a while.`
    );
    const promises = repos.map(async (repo) => {
      switch (this.mode) {
        case "watch":
          await this.watchRepo(repo);
          break;
        case "unwatch":
          await this.unwatchRepo(repo);
          break;
        case "ignore":
          await this.ignoreRepo(repo);
          break;
      }
    });
    await Promise.all(promises);
  }
}
