import { MLBB_SERVER } from "../constants.ts"
import { apiKey, fetchData } from "../core.ts"
import { writeToLog } from "../log.ts"
import { vmixImageURL, vmixTextURL } from "../vmix.ts"

export const getPostgameData = async (battleId: string) => {
  const url = MLBB_SERVER + "postdata?authkey=" + apiKey() + "&battleid=" +
    battleId + "&dataid=0"
  try {
    const response = await fetchData(url)
    if (!response) {
      throw new Error("postgameData is null or undefined")
    }
    return response
  } catch (error) {
    if (error instanceof Error) {
      await writeToLog({ url, status: "fail", message: error.message })
      throw error
    }
  }
}

export const extractTotalKillTeam = (
  team: "blue" | "red",
  postgameData: any,
) => {
  const condition = team === "blue" ? 1 : 2
  return postgameData.data.hero_list.reduce((acc: number, player: any) => {
    if (player.campid === condition) {
      return acc + player.kill_num
    } else {
      return acc
    }
  }, 0)
}

export const getPostgameTeamDataUrls = (
  postgameData: any,
  postgameBlockId: string,
) => {
  const urls: string[] = []
  // TODO: Implement logic to display win team and lose team

  // TODO: Get actual block name
  urls.push(
    vmixTextURL({
      blockId: postgameBlockId,
      blockName: "blue team kill",
      value: "" + extractTotalKillTeam("blue", postgameData),
    }),
  )
  urls.push(
    vmixTextURL({
      blockId: postgameBlockId,
      blockName: "red team kill",
      value: "" + extractTotalKillTeam("red", postgameData),
    }),
  )
  return urls
}

export const getPostgamePlayerData = (
  postgameData: any,
  playerName: string,
) => {
  const player = postgameData.data.hero_list.find((player: any) => {
    return player.name === playerName
  })
  if (!player) {
    console.log(`Cannot fetch player ${playerName} data`)
  }
  return {
    name: player.name,
    heroid: player.heroid,
    level: player.level,
    kill: player.kill_num,
    dead: player.dead_num,
    assist: player.assist_num,
    gold: player.total_money,
    items: player.equip_list,
  }
}

export const getPostgamePlayerUrls = (
  postgameData: any,
  postgameBlockId: string,
) => {
  return postgameData.data.hero_list.map((player: any, index: number) => {
    const playerData = getPostgamePlayerData(postgameData, player.name)
    const name = vmixTextURL({
      blockId: postgameBlockId,
      blockName: "player name",
      value: playerData.name,
    })
    const hero = vmixImageURL({
      blockId: postgameBlockId,
      blockName: "hero",
      value: playerData.heroid,
      type: "champ",
    })
    const level = vmixTextURL({
      blockId: postgameBlockId,
      blockName: "level",
      value: playerData.level,
    })
    const kill = vmixTextURL({
      blockId: postgameBlockId,
      blockName: "kill",
      value: playerData.kill,
    })
    const dead = vmixTextURL({
      blockId: postgameBlockId,
      blockName: "dead",
      value: playerData.dead,
    })
    const assist = vmixTextURL({
      blockId: postgameBlockId,
      blockName: "assist",
      value: playerData.assist,
    })
    const gold = vmixTextURL({
      blockId: postgameBlockId,
      blockName: "gold",
      value: playerData.gold,
    })
    // TODO: Update the name block of items slot
    const items: string[] = []
    playerData.items.forEach((item: any, i: number) => {
      items.push(
        vmixImageURL({
          blockId: postgameBlockId,
          blockName: `player${index + 1}.item${i + 1}`,
          value: item,
          type: "item",
        }),
      )
    })
    return [name, hero, level, kill, dead, assist, gold, ...items]
  })
}

/**
 * 1. Fetch the postgame URL
 * 2. Extract the data
 */
export const createPostgameUrls = async (
  battleId: string,
  postgameBlockId: string,
) => {
  // 1. Fetch the postgame URL
  const postData = await getPostgameData(battleId)
  // 2. Extract the data
  const teamData = getPostgameTeamDataUrls(postData, postgameBlockId)
  const playersData = getPostgamePlayerUrls(postData, postgameBlockId)

  return [...teamData, ...playersData]
}
