import { Box, Tooltip } from '@mui/material'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import { capitalizeFirstLetter } from '~/utils/formatters'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'

const MENU_STYLE = {
  color: 'white',
  backgroundColor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ Board }) {
  return (
    <Box sx={{
      backgroundColor: 'white',
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      paddingX: 2,
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={Board?.description}>
          <Chip
            sx={
              MENU_STYLE
            }
            icon={<DashboardIcon />} label={Board?.title}
            clickable
          />
        </Tooltip>
        <Chip
          sx={
            MENU_STYLE
          }
          icon={<VpnLockIcon />} label={capitalizeFirstLetter(Board?.type)}
          clickable
        />
        <Chip
          sx={
            MENU_STYLE
          }
          icon={<AddToDriveIcon />} label="Add to google drive"
          clickable
        />
        <Chip
          sx={
            MENU_STYLE
          }
          icon={<BoltIcon />} label="Automations"
          clickable
        />
        <Chip
          sx={
            MENU_STYLE
          }
          icon={<FilterListIcon />} label="Filters"
          clickable
        />
      </ Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <InviteBoardUser boardId={Board._id}/>
        <BoardUserGroup boardUsers={Board?.FE_allUsers}/>

      </ Box>

    </Box >

  )
}

export default BoardBar