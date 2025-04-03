// SDK initialization

import ImageKit from "imagekit"

import dotenv from "dotenv"
dotenv.config()

const imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_KEY_IMAGEKIT!,
  privateKey: process.env.PRIVATE_KEY_IMAGEKIT!,
  urlEndpoint: process.env.URL_ENDPOINT_IMAGEKIT!,
})

export default imagekit
