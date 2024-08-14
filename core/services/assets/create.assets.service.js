import * as fs from 'fs'
import { randomID } from "../../../common/crypto.random.js";
import sharp from 'sharp';
export class CreateAssetService {
    constructor(AssetsRepository) {
        this.assetsRepository = AssetsRepository;
        this.handle = this.handle.bind(this);
    }
    async handle(files, body) {
        try {
            if(!files || !body) return {success: false, error: 'Invalid arguments'};
            
            for ( const file in files ) {
                for (const item of files[file]) {
                    const fileName = randomID();
                    const localFileName = `public/image/${fileName}`;
                    const buffer = await sharp(item.buffer).resize({width:1920, height:1920, fit: 'contain'}).toBuffer();
                    fs.writeFile(localFileName, buffer, async(err, dt) => {
                        if(err) return {success: false, error: err};
                        const {success} = await this.assetsRepository.create(
                            {
                                imgId: fileName,
                                imagableId: body.id,
                                imagableType: body.type,
                            }
                        )
                        if (!success) {
                            fs.unlink(localFileName, (err,dt) => {
                                if(err) console.error(err);
                                console.log(`Deleted file: ${localFileName}`);
                            })
                           throw new Error("Could not insert into assets respository");
                        }
                    });
                }
            }
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message}
        }
    }
}