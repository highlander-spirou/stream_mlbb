import { vmixImageURL, vmixTextURL } from "../vmix.ts"

export const resetBanpick = (blockId: string) => {
  const urls: string[] = []

  for (let i = 1; i < 10; i++) {
    if (i < 6) {
      urls.push(
        vmixImageURL({
          blockId,
          blockName: "banxanh" + i + ".Source",
          value: 0,
          type: "champ",
        }),
      )
      urls.push(
        vmixImageURL({
          blockId,
          blockName: "pickxanh" + i + ".Source",
          value: 0,
          type: "champ",
        }),
      )
    } else {
      urls.push(
        vmixImageURL({
          blockId,
          blockName: "bando" + (i - 5) + ".Source",
          value: 0,
          type: "champ",
        }),
      )
      urls.push(
        vmixImageURL({
          blockId,
          blockName: "pickdo" + (i - 5) + ".Source",
          value: 0,
          type: "champ",
        }),
      )
    }
  }
  return urls
}

export const resetTeamName = (
  { banpickBlockId, ingameBlockId, postgameBlockId }: {
    banpickBlockId: string
    ingameBlockId: string
    postgameBlockId: string
  },
) => {
  const urls: string[] = []
  // TODO: change the block name to match the xml
  urls.push(
    vmixTextURL({
      blockId: banpickBlockId,
      blockName: "team1.Source",
      value: "",
    }),
  )
  urls.push(
    vmixTextURL({
      blockId: banpickBlockId,
      blockName: "team1.Source",
      value: "",
    }),
  )
  // TODO: change the block name to match the xml
  urls.push(
    vmixTextURL({
      blockId: ingameBlockId,
      blockName: "team1.Source",
      value: "",
    }),
  )
  urls.push(
    vmixTextURL({
      blockId: ingameBlockId,
      blockName: "team1.Source",
      value: "",
    }),
  )
  // TODO: change the block name to match the xml
  urls.push(
    vmixTextURL({
      blockId: postgameBlockId,
      blockName: "team1.Source",
      value: "",
    }),
  )
  urls.push(
    vmixTextURL({
      blockId: postgameBlockId,
      blockName: "team1.Source",
      value: "",
    }),
  )

  return urls
}

export const resetPostgame = (postgameBlockId: string) => {
  const urls: string[] = []
  for (let i = 1; i < 11; i++) {
    urls.push(
      ...[
        vmixTextURL({
          blockId: postgameBlockId,
          blockName: "playername" + i,
          value: "",
        }),
        vmixImageURL({
          blockId: postgameBlockId,
          blockName: "hero" + i,
          value: 0,
          type: "champ",
        }),
        vmixTextURL({
          blockId: postgameBlockId,
          blockName: "level" + i,
          value: "",
        }),
        vmixTextURL({
          blockId: postgameBlockId,
          blockName: "kill" + i,
          value: "",
        }),
        vmixTextURL({
          blockId: postgameBlockId,
          blockName: "dead" + i,
          value: "",
        }),
        vmixTextURL({
          blockId: postgameBlockId,
          blockName: "assist" + i,
          value: "",
        }),
        vmixTextURL({
          blockId: postgameBlockId,
          blockName: "gold" + i,
          value: "",
        }),
        ...Array(6).fill(0).map((_, index) => {
          return vmixImageURL({
            blockId: postgameBlockId,
            blockName: `player${index + 1}.item${i + 1}`,
            value: 0,
            type: "item",
          })
        }),
      ],
    )
  }
  return urls
}
