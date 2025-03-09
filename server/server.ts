import { Application, Router, send } from "@oak/oak"
import { displayLog, readLog } from "../lib/log.ts"

const app = new Application()
const router = new Router()

router.get("/log", async (ctx) => {
  const log = await readLog()
  const filter = ctx.request.url.searchParams.get("filter")
  if (filter) {
    const filtered = log.filter((x) => x.status === filter)
    filtered.reverse()
    ctx.response.body = displayLog(filtered)
  } else {
    log.reverse()
    ctx.response.body = displayLog(log)
  }
})

router.get("/champ/:id", async (ctx) => {
  await send(ctx, `static/hinhtuong/${ctx.params.id}.png`, {
    root: import.meta.dirname!,
  })
})
router.get("/item/:id", async (ctx) => {
  await send(ctx, `static/trangbi/${ctx.params.id}.png`, {
    root: import.meta.dirname!,
  })
})

app.use(router.routes())
app.use(router.allowedMethods())

console.log("Server running at http://localhost:8000")
await app.listen({ port: 8000 })
