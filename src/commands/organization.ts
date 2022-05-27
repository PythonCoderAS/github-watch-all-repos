import GithubWatchAllRepos from "../base";

export default class GithubWatchAllOrgRepos extends GithubWatchAllRepos {
    static description = "Watch all repositories under an organization.";

    static user = false;

    static args = [{name: "username", description: "The username of the organization to watch.", required: true}];
}
