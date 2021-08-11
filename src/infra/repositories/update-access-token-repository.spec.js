import MissingParamError from '../../utils/errors/missing-param-error'
import MongoHelper from '../helpers/mongo-helper'
import UpdateAccessTokenRepository from './update-access-token-repository'
let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)
  return {
    userModel,
    sut
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
    const { sut, userModel } = makeSut()

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

  test('Should throw if no UserModel is provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const userModel = db.collection('users')
    let fakeUser = {
      email: 'valid_email@email.com',
      name: 'any_name',
      age: 50,
      password: 'hashed_password'
    }
    const { insertedId } = await userModel.insertOne(fakeUser)
    fakeUser = { _id: insertedId, ...fakeUser }

    const promisse = sut.update(fakeUser._id, 'valid_token')
    await expect(promisse).rejects.toThrow()
  })

  test('Should throw if no params are provided', async () => {
    const { sut, userModel } = makeSut()
    let fakeUser = {
      email: 'valid_email@email.com',
      name: 'any_name',
      age: 50,
      password: 'hashed_password'
    }
    const { insertedId } = await userModel.insertOne(fakeUser)
    fakeUser = { _id: insertedId, ...fakeUser }
    await expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    await expect(sut.update(fakeUser._id)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
