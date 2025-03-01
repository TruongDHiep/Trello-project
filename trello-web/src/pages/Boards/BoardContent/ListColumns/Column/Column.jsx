import * as React from 'react'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import ContentCut from '@mui/icons-material/ContentCut'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Menu from '@mui/material/Menu'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Cloud from '@mui/icons-material/Cloud'
import DeleteForever from '@mui/icons-material/DeleteForever'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Divider from '@mui/material/Divider'
import AddCardIcon from '@mui/icons-material/AddCard'
import { Button } from '@mui/material'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import { createNewCardAPI, deleteColumnDetailsAPI, updateColumnDetailsAPI } from '~/apis'
import { cloneDeep } from 'lodash'
import { updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'


function Column({ column }) {
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const orderedCards = column.cards


  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')

  const addNewCard = async () => {
    if (!newCardTitle) {
      // console.log('Please enter column title')
      toast.error('Please enter column title')
      return
    }
    // console.log('Add new column:', newColumnTitle)

    // tao du lieu de goi api
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }

    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    //nang cao redux vid 68

    // cap nhat lai state board
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(c => c._id === createdCard.columnId)
    if (columnToUpdate) {

      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }

    }
    dispatch(updateCurrentActiveBoard(newBoard))

    // dong trang thai
    toggleNewCardForm()
    setNewCardTitle('')
  }

  //xu ly xoa column va card trong column
  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Delete this column ?',
      description: 'This action will permanently delete this column and all cards in it !',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'


    })
      .then(() => {
        /* ... */
        // cap nhat lai state board
        const newBoard = { ...board }
        newBoard.columns = newBoard.columns.filter(c => c._id !== column._id)
        newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== column._id)
        dispatch(updateCurrentActiveBoard(newBoard))
        // goi api xoa column
        deleteColumnDetailsAPI(column._id).then(res => {
          toast.success(res?.deleteResult)
        })
      })
      .catch(() => {
        /* ... */
      })
  }


  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging
  } = useSortable({ id: column._id, data: { ...column } })

  const dndKitColumnStyles = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const onUpdateColumnTitle = (newTitle) => {
    updateColumnDetailsAPI(column._id, { title: newTitle }).then( () => {
      const newBoard = cloneDeep(board)
      const columnToUpdate = newBoard.columns.find(c => c._id === column._id)
      if (columnToUpdate) {
        columnToUpdate.title = newTitle
      }
      dispatch(updateCurrentActiveBoard(newBoard))
    })
  }

  return (
    <div ref={setNodeRef}
      style={dndKitColumnStyles}
      {...attributes}

    >
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}
      >
        {/* Box Column Header */}
        <Box sx={{
          height: (theme) => theme.trello.columnHeaderHeight,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* <Typography variant='h6' sx={{
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            {column?.title}
          </Typography> */}
          <ToggleFocusInput
            data-no-dnd="true"
            value={column?.title}
            onChangedValue={onUpdateColumnTitle}
          />
          <Box>
            <Box>
              <Tooltip title="More options">
                <ExpandMoreIcon
                  sx={{
                    color: 'text.primary', cursor: 'pointer'
                  }}
                  id="basic-column-dropdown"
                  aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick} />
              </Tooltip>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button-workspaces'
                }}
              >
                <MenuItem
                  sx={{
                    '&:hover': {
                      color: 'success.light',
                      '& .add-card-icon': {
                        color: 'success.light'
                      }
                    }
                  }}
                  onClick={toggleNewCardForm}
                >
                  <ListItemIcon> <AddCardIcon className='add-card-icon' fontSize="small" /></ListItemIcon>
                  <ListItemText>Add new card</ListItemText>
                </MenuItem>

                <MenuItem>
                  <ListItemIcon> <ContentCut fontSize="small" /></ListItemIcon>
                  <ListItemText>Cut</ListItemText>
                </MenuItem>

                <MenuItem>
                  <ListItemIcon> <ContentCopy fontSize="small" /></ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>

                <MenuItem>
                  <ListItemIcon> <ContentPaste fontSize="small" /></ListItemIcon>
                  <ListItemText>Paste</ListItemText>
                </MenuItem>

                <Divider />

                <MenuItem sx={{
                  '&:hover': {
                    color: 'warning.dark',
                    '& .delete-forever-icon': {
                      color: 'warning.dark'
                    }
                  }
                }}
                onClick={handleDeleteColumn}
                >
                  <ListItemIcon><DeleteForever className='delete-forever-icon' fontSize="small" /> </ListItemIcon>
                  <ListItemText>Delete this column</ListItemText>
                </MenuItem>

                <MenuItem>
                  <ListItemIcon><Cloud fontSize="small" /> </ListItemIcon>
                  <ListItemText>Archive this column</ListItemText>
                </MenuItem>

              </Menu>
            </Box>
          </Box>
        </Box>

        <ListCards cards={orderedCards} />

        {/* Box footer */}
        <Box sx={{
          height: (theme) => theme.trello.columnFooterHeight,
          p: 2
        }}>
          {
            !openNewCardForm
              ?
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'space-between'
              }}>
                <Button startIcon={<AddCardIcon />} onClick={toggleNewCardForm}>
                  Add new card
                </Button>
                <Tooltip title="Drag to move">
                  <DragHandleIcon sx={{ cursor: 'pointer' }} />
                </Tooltip>
              </Box>
              : <Box sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <TextField
                  label="Enter column title..."
                  type="text"
                  size="small"
                  variant='outlined'
                  autoFocus
                  data-no-dnd="true"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  sx={{
                    '& label': { color: 'text-primary' },
                    '& input': {
                      color: (theme) => theme.palette.primary.main,
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#white')
                    },
                    '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                      '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                      '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                    },
                    '& .MuiOutlinedInput-input': { borderRadius: 1 }
                  }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    className="interceptor-loading"
                    onClick={addNewCard}
                    variant="contained" color='success' size="small"
                    data-no-dnd="true"
                    sx={{
                      boxShadow: 'none',
                      border: '0.5px solid',
                      borderColor: (theme) => theme.palette.success.main,
                      '&hover': { bgcolor: (theme) => theme.palette.success.main }
                    }}>Add</Button>
                  <CloseIcon fontSize="small"
                    data-no-dnd="true"
                    sx={{
                      color: (theme) => theme.palette.warning.light,
                      cursor: 'pointer'
                    }}
                    onClick={toggleNewCardForm}
                  />
                </Box>
              </Box>
          }

        </Box>

      </Box>
    </div>
  )
}

export default Column