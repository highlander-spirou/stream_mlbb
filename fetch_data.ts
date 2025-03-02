import { BASE_URL, FETCH_INTERVAL } from "./constant.ts";

interface IMatchData {}


export class MatchData {
    matchId: string
    private intervalTimeout: undefined | number
    public matchData: IMatchData | undefined

    constructor(matchId: string) {
        this.matchId = matchId
    }

    private async getMatchData() {
        const rsp = await fetch(BASE_URL + '/?apitoken=' + Deno.env.get("API_TOKEN"))
        return (await rsp.json())
    }

    private stop() {
        if (this.intervalTimeout) {
            clearInterval(this.intervalTimeout)
            this.intervalTimeout = undefined
        }
    }
    private start() {
        if (this.intervalTimeout) {
            this.stop()
        }
        this.intervalTimeout = setInterval(this.getMatchData, FETCH_INTERVAL)
    }
}