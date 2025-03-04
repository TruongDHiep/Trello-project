
import Typography from '@mui/material/Typography'
import { Button } from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch } from 'react-redux'
import { updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'


function CardTrello({ card }) {
  const dispatch = useDispatch()

  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging
  } = useSortable({ id: card._id, data: { ...card } })

  const dndKitCardStyles = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  }

  const shouldShowCardAction = () => {
    return card?.memberIds?.length || card?.comments?.length || card?.attachments
  }

  const setActiveCard = () => {
    dispatch(updateCurrentActiveCard(card))
  }

  return (
    <Card
      onClick={setActiveCard}
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        overflow: 'unset',
        display: card?.FE_placeholderCard ? 'none' : 'block',
        border: '1px solid transparent',
        '&:hover': { borderColor: (theme) => theme.palette.primary.main }
      }}>
      {card?.cover &&
        <CardMedia
          sx={{ height: 140 }}
          image={card?.cover}
        />}
      <CardContent sx={{ p: 1.5, '$:last-child': { p: 1.5 } }}>
        <Typography>
          {card?.title}
        </Typography>
      </CardContent>
      {shouldShowCardAction() &&
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.memberIds?.length &&
            <Button size="small" startIcon={<GroupIcon />}> {card?.memberIds?.length} </Button>}
          {!!card?.comments?.length &&
            <Button size="small" startIcon={<CommentIcon />}> {card?.comments?.length} </Button>}
          {!!card?.attachments?.length &&
            <Button size="small" startIcon={<AttachmentIcon />}> {card?.attachments?.length} </Button>}
        </CardActions>}

    </Card>
  )
}

export default CardTrello