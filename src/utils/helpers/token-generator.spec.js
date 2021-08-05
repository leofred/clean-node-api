import jwt from 'jsonwebtoken'
class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  generate (id) {
    return jwt.sign(id, this.secret)
  }
}

const makeSut = () => {
  return new TokenGenerator('secret')
}

describe('Token Generator', () => {
  test('Should return null if JWT returns null', () => {
    const sut = makeSut()
    jwt.token = null
    const token = sut.generate('any_id')
    expect(token).toBeNull()
  })

  test('Should return a token if JWT returns token', () => {
    const sut = makeSut()
    const token = sut.generate('any_id')
    expect(token).toBe(jwt.token)
  })

  test('Should call JWT with correct values', () => {
    const sut = makeSut()
    sut.generate('any_id')
    expect(jwt.id).toBe('any_id')
    expect(jwt.secret).toBe(sut.secret)
  })
})
