import { configs } from "./config.ts";
import { BASE_URL, VMIX_SERVER } from "./constant.ts";

interface IMatchData { }


class MatchData {
  matchId: string
  matchData: IMatchData | undefined

  constructor(matchId: string) {
    this.matchId = matchId
  }

  public async getMatchData() {
    const rsp = await fetch(BASE_URL + '/?apitoken=' + Deno.env.get("API_TOKEN"))
    return (await rsp.json())
  }
}

const processors: Record<string, (matchData: IMatchData | undefined) => any> = {
  "pureText": (matchData) => {
    matchData
    return ""
  }
}

class VmixUpdate {
  private createTextUpdateUrl(matchData: IMatchData | undefined, blockId: string, selectText: string, processor: string) {
    const value = processors[processor](matchData)
    return VMIX_SERVER + "?Function=SetText" + `&Input=${blockId}` + `&SelectedName=${selectText}` + `&Value=${value}`
  }

  private createImageUpdateUrl(matchData: IMatchData | undefined, blockId: string) {
    blockId
    matchData
    return ""
  }

  public sendVmixCommand(matchData: IMatchData | undefined) {
    const promises = configs.map(x => {
      const updateUrl = x.type === "text"
        ? this.createTextUpdateUrl(matchData, x.blockId, x.selectText!, x.processor!)
        : this.createImageUpdateUrl(matchData, x.blockId)
      return fetch(updateUrl)
    })

    Promise.allSettled(promises).then((results) =>
      results.forEach((result) => {
        if (result.status === "rejected") {
          console.log(result.reason)
        }
      }),
    )
  }
}

class Timer {
  private callbackFn: any
  private intervalTimeout: undefined | number
  public fetchInterval: number

  constructor(callbackFn: any, fetchInterval: number) {
    this.callbackFn = callbackFn
    this.fetchInterval = fetchInterval

  }

  public stop() {
    if (this.intervalTimeout) {
      clearInterval(this.intervalTimeout)
      this.intervalTimeout = undefined
    }
  }
  public start() {
    if (this.intervalTimeout) {
      this.stop()
    }
    this.intervalTimeout = setInterval(this.callbackFn(), this.fetchInterval)
  }
}


const matchData = new MatchData('abcdef')
const vmixUpdater = new VmixUpdate()

const matchDataTimer = new Timer(matchData.getMatchData(), 2500)
const updateTimer = new Timer(vmixUpdater.sendVmixCommand(matchData.matchData), 1000)

matchDataTimer.start()
updateTimer.start()
