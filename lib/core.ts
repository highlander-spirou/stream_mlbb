import { wrapErrorMessage, writeToLog } from "./log.ts"

export const apiKey = () => {
  const api_key = Deno.env.get("API_KEY")
  if (!api_key) throw new Error("API_KEY is not set")
}

export const parseMatchId = () => {
  const args = Deno.args
  const matchIdIndex = args.indexOf("--match-id")
  if (matchIdIndex === -1) {
    throw new Error("Match ID not found")
  }
  return args[matchIdIndex + 1]
}

export const formatTime = (startTime: number) => {
  const elapsedMs = Date.now() - startTime
  const minutes = String(Math.floor(elapsedMs / 60000)).padStart(2, "0")
  const seconds = String(Math.floor((elapsedMs % 60000) / 1000)).padStart(
    2,
    "0",
  )

  return { minutes, seconds }
}

export const fetchData = async (url: string) => {
  try {
    const response = await fetch(
      url,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      },
    )
    writeToLog({ url, status: "success", message: "" })
    return (await response.json())
  } catch (error) {
    if (error instanceof Error) {
      await writeToLog({ url, status: "fail", message: error.message })
      throw error
    }
  }
}

export const batchSend = async (urls: string[]) => {
  const promises = urls.map((url: any) => fetch(url))
  const results = await Promise.allSettled(promises)

  results.forEach(async (result, index) => {
    if (result.status === "rejected") {
      await writeToLog({
        url: urls[index],
        status: "fail",
        message: wrapErrorMessage(result.reason),
      })
    }
  })
}
