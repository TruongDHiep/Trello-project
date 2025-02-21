// import * as React from 'react'
// import { Box, Button, TextField, MenuItem } from '@mui/material'
// import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
// import Menu from '@mui/material/Menu'
// import { useState } from 'react'
// import { CreateNewBoard } from '~/redux/actions/boardAction'
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom' // Để điều hướng sau khi tạo thành công

// function CreateForm() {
//   const [title, setTitle] = React.useState('')
//   const [type, setType] = React.useState('public')
//   const [anchorEl, setAnchorEl] = React.useState(null)
//   const [errorMessage, setErrorMessage] = useState('')

//   const dispatch = useDispatch() // Thêm dispatch vào đây
//   const navigate = useNavigate() // Để điều hướng
//   const user = useSelector((state) => state.auth.user)
//   const ownerIds = [user._id || user]

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget)
//   }

//   const handleClose = () => {
//     setAnchorEl(null)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     console.log('Title:', title, 'Type:', type, 'User:', ownerIds)

//     try {
//       const response = await dispatch(CreateNewBoard({ title, type, ownerIds })) // Gửi dữ liệu
//       if (response.success) {
//         // Sau khi tạo thành công, chuyển hướng người dùng
//         handleClose() // Đóng form sau khi tạo
//       } else {
//         setErrorMessage(response.message)
//       }
//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.message) {
//         setErrorMessage(error.response.data.message)
//       } else {
//         setErrorMessage('Đã xảy ra lỗi. Vui lòng thử lại.')
//       }
//       console.error('Error:', error)
//     }

//     setTitle('') // Reset tiêu đề
//     setType('public') // Reset loại
//   }

//   const open = Boolean(anchorEl)

//   return (
//     <Box>
//       <Button
//         sx={{ color: 'white' }}
//         id="basic-button-recent"
//         aria-controls={open ? 'basic-menu-recent' : undefined}
//         aria-haspopup="true"
//         aria-expanded={open ? 'true' : undefined}
//         onClick={handleClick}
//         endIcon={<LibraryAddIcon />}
//       >
//         Create
//       </Button>

//       <Menu
//         id="basic-menu"
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         MenuListProps={{
//           'aria-labelledby': 'basic-button-recent'
//         }}
//       >
//         <Box
//           component="form"
//           onSubmit={handleSubmit}
//           sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}
//         >
//           <TextField
//             label="Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//           <TextField
//             select
//             label="Type"
//             value={type}
//             onChange={(e) => setType(e.target.value)}
//             required
//           >
//             <MenuItem value="public">Public</MenuItem>
//             <MenuItem value="private">Private</MenuItem>
//           </TextField>
//           <Button type="submit" variant="contained">Create</Button>
//           {errorMessage && <Box color="red">{errorMessage}</Box>} {/* Hiển thị thông báo lỗi nếu có */}
//         </Box>
//       </Menu>
//     </Box>
//   )
// }

// export default CreateForm
