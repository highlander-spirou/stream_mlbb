import { ingameBlockPrefixes, MLBB_SERVER } from "../constants.ts"
import { apiKey, fetchData } from "../core.ts"
import { writeToLog } from "../log.ts"
import { vmixImageURL, vmixTextURL } from "../vmix.ts"

export const getGameData = async (battleId: string) => {
  const url = MLBB_SERVER + "battledata?authkey=" + apiKey() + "&battleid=" +
    battleId +
    "&dataid=0"
  try {
    const response = await fetchData(url)
    if (!response) {
      throw new Error("gameData is null or undefined")
    }
    return response
  } catch (error) {
    if (error instanceof Error) {
      await writeToLog({ url, status: "fail", message: error.message })
      throw error
    }
  }
}

export const getState = (data: any) => {
  switch (data.data.state) {
    case "ban":
      return "ban"
    case "pick":
      return "pick"
    case "play":
      return "play"
    case "end":
      return "end"
    default:
      return "other"
  }
}

export const getTeam = (data: any) => {
  const gameData = data.data.camp_list

  let judge: any
  let blueTeam: any
  let redTeam: any

  gameData.forEach((element: any) => {
    switch (element.campid) {
      case 1:
        blueTeam = element
        break
      case 2:
        redTeam = element
        break
      default:
        judge = element
        break
    }
  })

  return { judge, redTeam, blueTeam }
}

export const getTeamName = (team: any) => {
  return team.team_name
}

export const getPlayer = (team: any, pos: number) => {
  return team.player_list.find((player: any) => {
    return player.pos === pos
  })
}

export const getPlayerBanPickStatus = (player: any) => {
  return {
    heroban: player.ban_heroid,
    heropick: player.heroid,
  }
}

export const getTeamIngameStatus = (team: any) => {
  return {
    score: team.score,
    total_money: team.total_money,
    kill_tortoise: team.kill_tortoise,
    kill_lord: team.kill_lord,
    kill_tower: team.kill_tower,
  } as any
}

export const createIngameUrls = (
  team: any,
  side: "blue" | "red",
  ingameBlockId: string,
) => {
  return Object.keys(ingameBlockPrefixes).map((key) => {
    const value =
      getTeamIngameStatus(team)[key as keyof typeof ingameBlockPrefixes]
    const blockText = side === "blue" ? "xanh.Text" : "do.Text"
    return vmixTextURL({
      blockId: ingameBlockId,
      blockName: ingameBlockPrefixes[key as keyof typeof ingameBlockPrefixes] +
        blockText,
      value: "" + value,
    })
  })
}

export const createBanPickUrls = (
  { phase, banpickBlockId, blueTeam, redTeam }: {
    phase: "ban" | "pick"
    blueTeam: any
    redTeam: any
    banpickBlockId: string
  },
) => {
  const result: string[] = []
  for (let i = 1; i <= 10; i++) {
    try {
      if (i < 6) {
        const player = getPlayer(blueTeam, i)
        const banpickStat = getPlayerBanPickStatus(player)
        const stat = phase === "ban"
          ? banpickStat.heroban
          : banpickStat.heropick
        if (stat !== 0) {
          console.log(`Player ${i} is ${phase}ing`)
          result.push(
            vmixImageURL({
              blockId: banpickBlockId,
              blockName: phase + "xanh" + i + ".Source",
              value: stat,
              type: "champ",
            }),
          )
        }
      } else {
        const player = getPlayer(redTeam, i)
        const banpickStat = getPlayerBanPickStatus(player)
        const stat = phase === "ban"
          ? banpickStat.heroban
          : banpickStat.heropick
        if (stat !== 0) {
          console.log(`Player ${i} is ${phase}ing`)
          result.push(
            vmixImageURL({
              blockId: banpickBlockId,
              blockName: phase + "do" + (i - 5) + ".Source",
              value: stat,
              type: "champ",
            }),
          )
        }
      }
    } catch (_error) {
      console.log("Cannot fetch player", i)
    }
  }
  return result
}
