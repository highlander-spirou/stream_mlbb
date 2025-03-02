interface Config {
    blockId: string
    type: "image" | "text"
    selectText?: string
    value?: string
    processor?: string
}


export const configs: Config[] = []