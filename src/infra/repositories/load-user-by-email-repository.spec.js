import MissingParamError from '../../utils/errors/missing-param-error'
import MongoHelper from '../helpers/mongo-helper'
import LoadUserByEmailRepository from './load-user-by-email-repository'
let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)
  return {
    sut,
    userModel
  }
}

describe('LoadUserByEmail Repository', () => {
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

  test('Should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_email@email.com')
    expect(user).toBeNull()
  })

  test('Should return an user if user is found', async () => {
    const { sut, userModel } = makeSut()
    let fakeUser = {
      email: 'valid_email@email.com',
      name: 'any_name',
      age: 50,
      password: 'hashed_password'
    }
    const { insertedId } = await userModel.insertOne(fakeUser)
    fakeUser = { _id: insertedId, ...fakeUser }
    const user = await sut.load('valid_email@email.com')
    expect(user).toEqual({
      _id: fakeUser._id,
      password: fakeUser.password
    })
  })

  test('Should throw if no UserModel is provided', async () => {
    const sut = new LoadUserByEmailRepository()
    const promisse = sut.load('any_email@email.com')
    await expect(promisse).rejects.toThrow()
  })

  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promisse = sut.load()
    await expect(promisse).rejects.toThrow(new MissingParamError('email'))
  })
})
