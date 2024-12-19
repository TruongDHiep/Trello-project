import React from 'react'
import AppBar from '../../components/AppBar/AppBar'
import { Container, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import InboxIcon from '@mui/icons-material/Inbox'
import DraftsIcon from '@mui/icons-material/Drafts'
import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import StarBorder from '@mui/icons-material/StarBorder'
import { Card, CardHeader } from '@mui/material'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination'
import { useParams } from 'react-router-dom'
import { fetchUserBoardsAPI } from '~/apis'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


function Home() {
  const [selectedIndex, setSelectedIndex] = useState(1)
  const navigate = useNavigate()
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index)
  }

  const [open, setOpen] = React.useState(true)

  const handleClick = () => {
    setOpen(!open)
  }

  const { id } = useParams()
  const [boards, setBoards] = useState([])

  useEffect(() => {
    const fetchBoards = async () => {
      const userBoards = await fetchUserBoardsAPI(id)
      console.log('boards:', userBoards)
      setBoards(userBoards)
    }
    fetchBoards()
  }, [id])


  const [page, setPage] = useState(1)
  const boardsPerPage = 6
  const totalPages = Math.ceil(boards.length / boardsPerPage)

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const handleCickCard = (BoardId) => {
    navigate(`/board/${BoardId}`)
  }

  // const paginatedBoards = boards.slice((page - 1) * boardsPerPage, page * boardsPerPage)

  return (
    <>
      <Container disableGutters maxWidth={false} sx={{
        height: '100vh', bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495E' : '#1976D2')
      }}>
        <AppBar />
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'row'
        }}>
          <Box sx={{
            margin: ' 20px 0 0 ',
            maxHeight: '90vh',
            position: 'sticky',
            padding: '16px',
            top: '40px',
            width: '256px',
            overflowY: 'auto',
            color: 'white'

          }}>
            <Box sx={{
              width: '100%', maxWidth: 360, bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495E' : '#1976D2')
            }}>
              <List component="nav" aria-label="main mailbox folders">
                <ListItemButton
                  selected={selectedIndex === 0}
                  onClick={(event) => handleListItemClick(event, 0)}
                >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Boards" />
                </ListItemButton>
                <ListItemButton
                  selected={selectedIndex === 1}
                  onClick={(event) => handleListItemClick(event, 1)}
                >
                  <ListItemIcon>
                    <DraftsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </List>
              <Divider />
              <Box sx={{ margin: '5px' }}>
                <Typography variant='caption'>All working space </Typography>
              </Box>
              <List component="nav" aria-label="secondary mailbox folder">

                <ListItemButton onClick={handleClick}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="My working space 1" />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}
                      selected={selectedIndex === 4}
                      onClick={(event) => handleListItemClick(event, 4)}
                    >
                      <ListItemIcon>
                        <StarBorder />
                      </ListItemIcon>
                      <ListItemText primary="Board 1" />
                    </ListItemButton>
                  </List>
                </Collapse>
              </List>
            </Box>
          </Box>
          <Box sx={{
            margin: ' 20px 0',
            maxWidth: '825px',
            minWidth: '288px',
            width: '100%',
            height: '100%',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495E' : '#1976d2'),
            color: 'white'
          }}>
            <Box sx={{
              width: '100%',
              padding: '16px'
            }}>

              <Typography variant="h4">All Boards</Typography>

              <Grid container spacing={2} sx={{ marginTop: '5px' }}>
                {boards.map((board) => (
                  <Grid item xs={12} sm={6} md={4} key={board._id}>
                    <Card onClick={() => handleCickCard(board._id)} sx={{ cursor: 'pointer' }}>
                      <CardHeader title={board.title} />
                      <CardContent>
                        <Typography>{board.description}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'white'
                    },
                    '& .Mui-selected': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                />
              </Box>
            </Box>

          </Box>
        </Box>

      </Container >
    </>
  )
}

export default Home
