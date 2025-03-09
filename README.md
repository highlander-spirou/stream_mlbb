Run exe: `.\stream_mlbb.exe --match-id adsabnmasf`

Compile: `deno compile --allow-read --allow-net --allow-env --env-file=.env --target x86_64-pc-windows-msvc --include ./server/static main.ts`

Run test: `deno run --allow-read --allow-net --allow-env --env-file=.env main.ts --match-id adsabnmasf`

Benchmark: `deno run --allow-read --allow-net --allow-env --env-file=.env main.ts --benchmark --match-id adsabnmasf`
