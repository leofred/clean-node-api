import { serverError, badRequest, unauthorizedError, ok } from '../helpers/http-response'
import MissingParamError from '../helpers/missing-param-error'
import InvalidParamError from '../helpers/invalid-param-error'
class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return badRequest(new MissingParamError('email'))
      }
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }
      if (!password) {
        return badRequest(new MissingParamError('password'))
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
