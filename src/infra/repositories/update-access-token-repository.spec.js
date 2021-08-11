import MongoHelper from '../helpers/mongo-helper'
let db

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    await this.userModel.updateOne({
      _id: userId
    }, {
      $set: {
        accessToken
      }
    })
  }
}

describe('UpdateAccessToken Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should update the user with the given accessToken', async () => {
    const userModel = db.collection('users')

    const sut = new UpdateAccessTokenRepository(userModel)

    let fakeUser = {
      email: 'valid_email@email.com',
      name: 'any_name',
      age: 50,
      password: 'hashed_password'
    }
    const { insertedId } = await userModel.insertOne(fakeUser)
    fakeUser = { _id: insertedId, ...fakeUser }

    await sut.update(fakeUser._id, 'valid_token')
    const updatedFakeUser = await userModel.findOne({ _id: fakeUser._id })
    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })
})
