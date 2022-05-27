import GithubWatchAllRepos from "../base";

export default class GithubWatchAllUserRepos extends GithubWatchAllRepos {
    static description = "Watch all repositories under a personal user account.";

    static user = true;

    static args = [{name: "username", description: "The username of the user to watch.", required: true}];
}
