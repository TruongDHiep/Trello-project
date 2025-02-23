import { useState, useEffect } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'
import { set } from 'lodash'


function AccountVerification() {
  //lay gia tri email va token tu url
  let [searchParams] = useSearchParams()
  // const email = searchParams.get('email')
  // const token = searchParams.get('token')
  const { email, token } = Object.fromEntries([...searchParams])
  console.log(email, token)

  const [Verified, setVerified] = useState(false)

  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true))
    }

  }, [email, token])

  if (!email || !token) {
    return <Navigate to="/404" />
  }

  if (!Verified) {
    return <PageLoadingSpinner caption="Verifying your account..." />
  }


  return <Navigate to={`/login?verifiedEmail=${email}`} />

}

export default AccountVerification