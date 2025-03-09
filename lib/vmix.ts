import { XMLParser } from "@fast-xml-parser"
import { API_SERVER, VMIX_SERVER } from "./constants.ts"
import { writeToLog } from "./log.ts"

export const getVmixXML = async () => {
  try {
    const xmlSrc = await fetch(VMIX_SERVER, {
      method: "GET",
      headers: {
        "Accept": "application/xml",
      },
    })

    const xmlString = await xmlSrc.text()
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
    })
    const parsedXML = parser.parse(xmlString)

    const inputs = parsedXML.vmix.inputs
    let ingame: any
    let banpick: any
    let postgame: any

    inputs.input.forEach((element: any) => {
      if (element.title === "ingame02.gtzip") {
        ingame = element
      } else if (element.title === "test bnp.gtzip") {
        banpick = element
      } else if (element.title === "result.gtzip") {
        postgame = element
      }
    })
    return { ingame: ingame.key, banpick: banpick.key, postgame: postgame }
  } catch (error) {
    if (error instanceof Error) {
      await writeToLog({
        url: VMIX_SERVER,
        status: "fail",
        message: error.message,
      })
    }
    throw error
  }
}

export const vmixTextURL = (
  { blockId, blockName, value }: {
    blockName: string
    blockId: string
    value: string
  },
) => {
  return VMIX_SERVER + `/?` + "Function=SetText&Input=" + blockId +
    "&SelectedName=" + blockName + "&Value=" + value
}

export const vmixImageURL = (
  { blockId, blockName, value, type }: {
    blockName: string
    blockId: string
    value: number
    type: "champ" | "item"
  },
) => {
  return VMIX_SERVER + `/?` + "Function=SetImage&Input=" + blockId +
    "&SelectedName=" + blockName + "&Value=" + `${API_SERVER}/${type}/${value}`
}
