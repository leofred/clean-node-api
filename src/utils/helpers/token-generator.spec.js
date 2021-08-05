
class TokenGenerator {
  generate (id) {
    return null
  }
}

describe('Token Generator', () => {
  test('Should return null if JWT returns null', () => {
    const sut = new TokenGenerator()
    const token = sut.generate('any_id')
    expect(token).toBeNull()
  })
})
