import { Octokit } from '@octokit/rest';

export type RepoClientMode = "watch" | "unwatch" | "ignore";

export interface RepoClientConstructorOptions {
    username: string;
    token: string;
    isUser: boolean;
    mode: RepoClientMode;
}

/**
 * A class to make it easier to work with the octokit library. This stores the username and token for future use.
 */
export class RepoClient {
    username: string;
    octokit: Octokit;
    isUser: boolean;
    mode: RepoClientMode;

    constructor(params: RepoClientConstructorOptions) {
        this.username = params.username;
        this.octokit = new Octokit({
            auth: params.token
        });
        this.isUser = params.isUser;
        this.mode = params.mode;
    }

    /**
     * Get a list of repositories for the user/org.
     * We only care about the name attribute so there's no point in specifying any other properties.
     */
    async getRepos(): Promise<{ name: string }[]> {
        if (this.isUser) {
            return await this.octokit.paginate(this.octokit.repos.listForUser, {
                username: this.username,
                per_page: 100,
                type: "all"
            })
        } else {
            return await this.octokit.paginate(this.octokit.repos.listForOrg, {
                org: this.username,
                per_page: 100,
                type: "all"
            });
        }
    }

    async watchRepo(repo: string): Promise<void> {
        await this.octokit.activity.setRepoSubscription({
            owner: this.username,
            repo: repo,
            subscribed: true
        });
    }

    async unwatchRepo(repo: string): Promise<void> {
        await this.octokit.activity.setRepoSubscription({
            owner: this.username,
            repo: repo,
            subscribed: false,
            ignored: false
        });
    }

    async ignoreRepo(repo: string): Promise<void> {
        await this.octokit.activity.setRepoSubscription({
            owner: this.username,
            repo: repo,
            ignored: true
        });
    }

    async main(): Promise<void> {
        const repos = await this.getRepos();
        console.log(`Found ${repos.length} repositories. This may take a while.`);
        const promises = repos.map(async (repo) => {
            switch (this.mode) {
                case "watch":
                    await this.watchRepo(repo.name);
                    break;
                case "unwatch":
                    await this.unwatchRepo(repo.name);
                    break;
                case "ignore":
                    await this.ignoreRepo(repo.name);
                    break;
            }
        });
        await Promise.all(promises);
    }
}
