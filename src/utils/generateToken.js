import jwt from 'jsonwebtoken'
const generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: '3d',
    algorithm: 'HS256'
  })
}

export default generateToken
