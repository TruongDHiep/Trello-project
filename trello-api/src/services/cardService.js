
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'


const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newCard = {
      ...reqBody
    }

    const createdCard = await cardModel.createNew(newCard)

    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    // .......
    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)

    }

    return getNewCard
  } catch (error) { throw error }
}

const update = async (cardId, reqBody, cardCoverFile) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    let updatedCard = {}

    if (cardCoverFile) {
      // upload len cloudinary
      const uploadResult = await CloudinaryProvider.streamUpload(cardCoverFile.buffer, 'card-covers')

      // luu lai avatarUrl
      updatedCard = await cardModel.update(cardId, { cover: uploadResult.secure_url })

    } else {

      const updatedCard = await cardModel.update(cardId, updateData)
    }

    return updatedCard
  } catch (error) { throw error }
}

export const cardService = {
  createNew,
  update
}