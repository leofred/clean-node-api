import { serverError, badRequest, unauthorizedError, ok } from '../helpers/http-response'

class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return badRequest('email')
      }
      if (!password) {
        return badRequest('password')
      }
      const accessToken = await this.authUseCase.auth(email, password)
      if (!accessToken) return unauthorizedError()
      return ok({ accessToken })
    } catch (error) {
      // console.error(error)
      return serverError()
    }
  }
}

module.exports = { LoginRouter }
