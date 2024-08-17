import app from "../config/app.js"

/**
 * 
 * @param {*} name  - file name
 * @param {*} mimeType - file type/ mimetype
 * @param {*} storage - storage public/image
 * @returns 
 */
export const prepareImageUrl =  (name,  mimeType = 'image/jpeg', storage = 'public/image') => `${app.url}/${storage}/${name}.${mimeType.split('/')[1]}`