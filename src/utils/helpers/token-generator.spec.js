import jwt from 'jsonwebtoken'
class TokenGenerator {
  generate (id) {
    return jwt.sign(id, 'secret')
  }
}

describe('Token Generator', () => {
  test('Should return null if JWT returns null', () => {
    const sut = new TokenGenerator()
    jwt.token = null
    const token = sut.generate('any_id')
    expect(token).toBeNull()
  })

  test('Should return a token if JWT returns token', () => {
    const sut = new TokenGenerator()
    const token = sut.generate('any_id')
    expect(token).toBe(jwt.token)
  })
})
