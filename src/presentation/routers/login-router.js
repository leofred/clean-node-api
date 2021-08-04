import { serverError, badRequest, unauthorizedError, ok } from '../helpers/http-response'

class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    if (!httpRequest || !httpRequest.body || !this.authUseCase || !this.authUseCase.auth) {
      return serverError()
    }
    const { email, password } = httpRequest.body
    if (!email) {
      return badRequest('email')
    }
    if (!password) {
      return badRequest('password')
    }
    const accessToken = this.authUseCase.auth(email, password)
    if (!accessToken) return unauthorizedError()
    return ok({ accessToken })
  }
}

module.exports = { LoginRouter }
