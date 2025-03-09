import { batchSend, formatTime, parseMatchId } from "./lib/core.ts"
import {
  createBanPickUrls,
  createIngameUrls,
  getGameData,
  getState,
  getTeam,
} from "./lib/game/game_stat.ts"
import { createPostgameUrls } from "./lib/game/postgame.ts"
import {
  resetBanpick,
  resetPostgame,
  resetTeamName,
} from "./lib/game/pregame.ts"
import { getVmixXML } from "./lib/vmix.ts"

/**
 * **Prepare**
 *
 * 1. Get all blocks from Vmix server
 * 2. Clear all the blocks content
 * 3. Get the matchId
 *
 * **Looping**
 *
 * 4. Fetch the data from MLBB_SERVER
 * 5. Create the URL according to each phase
 * 6. Stream the change to Vmix server
 *
 * **Ending**
 *
 * 7. Stream the postgame to Vmix server
 */
const stream = async () => {
  // 1. Get all blocks from Vmix server
  const {
    banpick: banpickBlockId,
    ingame: ingameBlockId,
    postgame: postgameBlockId,
  } = await getVmixXML()

  // 2. Clear all the blocks content
  const resetBanpickUrls = resetBanpick(banpickBlockId)
  const resetTeamNameUrls = resetTeamName({
    banpickBlockId,
    ingameBlockId,
    postgameBlockId,
  })
  const resetPostgameUrls = resetPostgame(postgameBlockId)
  batchSend([...resetBanpickUrls, ...resetTeamNameUrls, ...resetPostgameUrls])

  // 3. Get the matchId
  const matchId = parseMatchId()

  const startTime = Date.now()

  const interval = setInterval(async () => {
    try {
      // 4. Fetch the data from MLBB_SERVER
      const gameData = await getGameData(matchId)
      const state = getState(gameData)
      const { blueTeam, redTeam, judge: _judge } = getTeam(gameData)

      // 7. Stream the postgame if game end
      if (state === "end") {
        const postgameUrls = await createPostgameUrls(matchId, postgameBlockId)
        batchSend(postgameUrls)
        clearInterval(interval)
        return
      }

      // 5. Create the URL according to each phase
      if (state === "other") {
        console.log("Game is on loading state, nothing to stream to vmix ...")
        return
      }
      const urls: string[] = []
      if (state === "ban") {
        createBanPickUrls({ phase: "ban", blueTeam, redTeam, banpickBlockId })
          .forEach((url) => {
            urls.push(url)
          })
      } else if (state === "pick") {
        createBanPickUrls({ phase: "pick", blueTeam, redTeam, banpickBlockId })
          .forEach((url) => {
            urls.push(url)
          })
      } else if (state === "play") {
        createIngameUrls(blueTeam, "blue", ingameBlockId).forEach((url) => {
          urls.push(url)
        })
        createIngameUrls(redTeam, "red", ingameBlockId).forEach((url) => {
          urls.push(url)
        })
      }
      // 6. Stream the change to Vmix server
      batchSend(urls)
    } catch (_error) {
      const { minutes, seconds } = formatTime(startTime)
      console.log(`${minutes}:${seconds} - fail to execute`)
    }
  }, 1000)
}

const benchmark = async () => {
  const start = performance.now()

  const {
    banpick: banpickBlockId,
    ingame: ingameBlockId,
    postgame: postgameBlockId,
  } = await getVmixXML()
  const matchId = parseMatchId()
  const gameData = await getGameData(matchId)
  const { blueTeam, redTeam, judge: _judge } = getTeam(gameData)

  const urls: string[] = []

  createBanPickUrls({ phase: "ban", blueTeam, redTeam, banpickBlockId })
    .forEach((url) => {
      urls.push(url)
    })
  createBanPickUrls({ phase: "pick", blueTeam, redTeam, banpickBlockId })
    .forEach((url) => {
      urls.push(url)
    })
  createIngameUrls(blueTeam, "blue", ingameBlockId).forEach((url) => {
    urls.push(url)
  })
  createIngameUrls(redTeam, "red", ingameBlockId).forEach((url) => {
    urls.push(url)
  })

  try {
    const postgameUrls = await createPostgameUrls(matchId, postgameBlockId)
    postgameUrls.forEach((url) => {
      urls.push(url)
    })
  } catch (_error) {
    console.log("Game has not end!")
  }

  console.log(urls)

  batchSend(urls)

  const end = performance.now()
  console.log(`Execution time: ${(end - start).toFixed(3)} ms`)
}

async function start() {
  if (Deno.args.includes("--benchmark")) {
    await benchmark()
  } else {
    await stream()
  }
}

await start()
