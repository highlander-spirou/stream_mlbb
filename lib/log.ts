export const writeToLog = async (
  { message, status, url }: {
    url: string
    message: string
    status: "success" | "fail"
  },
) => {
  const logFilePath = Deno.cwd() + "/log.csv"
  const now = new Date()
  const dateTime = `${String(now.getHours()).padStart(2, "0")}:${
    String(now.getMinutes()).padStart(2, "0")
  }:${String(now.getSeconds()).padStart(2, "0")}`

  const logEntry = `${dateTime},${url},${status},${message}\n`
  await Deno.writeTextFile(logFilePath, logEntry, { append: true })
}

export const wrapErrorMessage = (message: string) => {
  return `"${String(message || "Unknown error").replace(/"/g, '""')}"`
}

export const readLog = async () => {
  const logFilePath = Deno.cwd() + "/log.csv"
  const fileContent = await Deno.readTextFile(logFilePath)
  const lines = fileContent.split("\n")
  const result: any[] = []

  for (const line of lines) {
    const columns = line.split(",")
    if (columns.length === 4) {
      const row = {
        time: columns[0],
        url: columns[1],
        status: columns[2],
        message: columns[3],
      }
      result.push(row)
    }
  }
  return result
}

export const displayLog = (data: Record<string, string>[]) => {
  let str = ""
  data.forEach((row) => {
    str = str + `${row.time}, ${row.url}, ${row.message}\n`
  })
  return str
}
