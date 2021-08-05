module.exports = {
  isEmailValid: true,
  email: null,
  isEmail (email) {
    this.email = email
    return this.isEmailValid
  }
}
