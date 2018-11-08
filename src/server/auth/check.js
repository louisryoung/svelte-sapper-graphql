import { userModel } from '../../models/user'
import { verifyToken, generateToken } from './utils'
import { filterProfile } from '../users/filter'

const check = (req, res) => {
  let token = req.cookies.token
  if (Boolean(token) === false) {
    return res.status(401).send({ auth: false, message: 'No token provided' })
  }

  let decoded = verifyToken(token)
  if (decoded === false) {
    return res.status(401).send({ auth: false, message: 'Invalid token' })
  }

  userModel
    .findOne({ _id: decoded._id })
    .exec()
    .then(user => {
      user = JSON.parse(JSON.stringify(user))

      let token = generateToken({
        email: user.email,
        _id: user._id,
      })
      return res.status(200).json({
        token,
        user: filterProfile(user),
      })
    })
    .catch(error => {
      return res.status(401).json({
        failed: 'Unauthorized Access',
        error
      })
    })
}

export default check
