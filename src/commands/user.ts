import GithubWatchAllRepos from "../base";
import {Flags} from "@oclif/core";

export default class GithubWatchAllUserRepos extends GithubWatchAllRepos {
    static description = "Watch all repositories under a personal user account.";

    user = true;

    static flags = {
        ...GithubWatchAllRepos.flags,
        collaborator: Flags.boolean({description: "Watch all repositories that the user is a collaborator on (only usable if the specificed user is the authenticated user).", default: false})
    }


    async run(): Promise<void> {
        return super.run(GithubWatchAllUserRepos);
    }

    static args = [{name: "username", description: "The username of the user to watch.", required: true}];
}
