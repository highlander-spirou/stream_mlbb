type ImageTypes = "loadscreen" | "thumbnail"

export class Image {
    imgId: string
    imgType: ImageTypes

    constructor(imgId: string, imgType: ImageTypes) {
        this.imgId = imgId
        this.imgType = imgType
    }

    private get imgName(): string {
        return this.imgType + "_" + this.imgId + ".png"
    }

    private get imageURL(): string {
        return "acme.example.com/" + this.imgName
    }

    private get imageFolder(): string {
        const tempDir = Deno.env.get("TEMP") || Deno.env.get("TMP");
        return tempDir + '/' + this.imgName
    }

    private async downloadImage() {
        const fileResponse = await fetch(this.imageURL);
        if (fileResponse.body) {
            const file = await Deno.open(this.imageFolder, { write: true, create: true });

            await fileResponse.body.pipeTo(file.writable);
        }
    }


    private async checkImg() {
        try {
            const fileStat = await Deno.stat(this.imageFolder);
            return fileStat.isFile; // Ensure it's a file, not a directory
        } catch (error) {
            if (error instanceof Deno.errors.NotFound) {
                return false; // Image doesn't exist
            }
            throw error; // Rethrow unexpected errors
        }
    }

    public async getImage() {
        const isImg = await this.checkImg()
        if (!isImg) {
            await this.downloadImage()
        }
        return this.imageFolder
    }

}