import {Octokit} from '@octokit/rest';
import {version} from './package.json';

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
    flags?: { collaborator?: boolean, [key: string]: any } // We need [key: string]: any to stop TS errors.
}

/**
 * An interface for expected return data from Octokit repository listing methods.
 */
export interface RepoData {
    name: string,
    owner: { login: string }
}

/**
 * A class to make it easier to work with the octokit library. This stores the username and token for future use.
 */
export class RepoClient {
    username: string;
    octokit: Octokit;
    isUser: boolean;
    mode: RepoClientMode;
    collaborator: boolean


    constructor(params: RepoClientConstructorOptions) {
        this.username = params.username;
        this.octokit = new Octokit({
            auth: params.token,
            userAgent: `github-watch-all-repos v${version}`
        });
        this.isUser = params.isUser;
        this.mode = params.mode;
        this.collaborator = params.flags?.collaborator ?? false;
    }

    /**
     * Get a list of repositories for the user/org.
     * We only care about the name and owner attributes so there's no point in specifying any other properties.
     */
    async getRepos(): Promise<RepoData[]> {
        if (this.isUser) {
            return await this.octokit.paginate(this.octokit.repos.listForUser, {
                username: this.username,
                per_page: 100,
                type: this.collaborator ? "all" : "owner"
            })
        } else {
            return await this.octokit.paginate(this.octokit.repos.listForOrg, {
                org: this.username,
                per_page: 100,
                type: "all"
            });
        }
    }

    async watchRepo(repo: RepoData): Promise<void> {
        await this.octokit.activity.setRepoSubscription({
            owner: repo.owner.login,
            repo: repo.name,
            subscribed: true
        });
    }

    async unwatchRepo(repo: RepoData): Promise<void> {
        await this.octokit.activity.setRepoSubscription({
            owner: repo.owner.login,
            repo: repo.name,
            subscribed: false,
            ignored: false
        });
    }

    async ignoreRepo(repo: RepoData): Promise<void> {
        await this.octokit.activity.setRepoSubscription({
            owner: repo.owner.login,
            repo: repo.name,
            ignored: true
        });
    }

    async main(): Promise<void> {
        const repos = await this.getRepos();
        console.log(`Found ${repos.length} repositories. This may take a while.`);
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
