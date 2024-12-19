import { Container, Paper, Typography, TextField, Button, Box, Link, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { loginUser } from '~/redux/actions/authAction'
import { useDispatch, useSelector } from 'react-redux'
import { registerAPI } from '~/apis'
import { jwtDecode } from 'jwt-decode'


function Auth({ isLogin }) {
  const navigate = useNavigate()
  const dispatch = useDispatch() // Thêm dispatch vào đây
  const [errorMessage, setErrorMessage] = useState('')
  const error = useSelector((state) => state.auth.error) // Lấy lỗi từ Redux store
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)


  // Schema xác thực cho form
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    username: !isLogin ? Yup.string().required('Username is required') : Yup.string() // Không cần validate username khi login
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      username: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (isLogin) {
          const { username, ...newValues } = values
          // Dispatch action loginUser thay vì gọi API trực tiếp
          const response = await dispatch(loginUser(newValues)) // Đảm bảo loginUser trả về Promise hoặc xử lý kết quả đúng

          if (response.success) {
            const user = response.user
            navigate(`/user/${user}`)
          } else {
            setErrorMessage(response.message)
          }
        } else {
          // Tương tự cho đăng ký, có thể tạo một action riêng nếu cần
          const data = await registerAPI(values)
          localStorage.setItem('token', data.token)
          navigate('/login')
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message)
        } else {
          setErrorMessage('Đã xảy ra lỗi. Vui lòng thử lại.')
        }
        console.error('Error:', error)
      }
    }
  })

  const toggleForm = () => {
    const newPath = isLogin ? '/register' : '/login';
    navigate(newPath)
    formik.resetForm()// Reset form khi chuyển đổi giữa đăng nhập và đăng ký
    setErrorMessage('')// Reset thông báo lỗi khi chuyển form
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#FAFBFC'),
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            marginTop: 8,
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#FFFFFF'),
            color: (theme) => (theme.palette.mode === 'dark' ? '#white' : '#black')
          }}
        >
          <Typography component="h1" variant="h5">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            {/* Hiển thị thông báo lỗi từ Redux nếu có */}
            {(errorMessage || error) && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {'Invalid email or password' || 'Invalid email or password'}
              </Alert>
            )}
            {!isLogin && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
              />
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus={isLogin}
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component="button" variant="body2" onClick={toggleForm}>
                {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Sign In'}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Auth
