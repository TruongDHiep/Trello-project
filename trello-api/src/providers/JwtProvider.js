
import JWT from 'jsonwebtoken'

const generateToken = (userInfo, secretSignature, tokenLife) => {
  try {
    //
    return JWT.sign(userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  }
  catch (error) {
    throw error
  }
}


const verifyToken = (token, secretSignature) => {
  try {
    //
    return JWT.verify(token, secretSignature)
  }
  catch (error) {
    throw error
  }

}

export const JwtProvider = {
  generateToken,
  verifyToken
}