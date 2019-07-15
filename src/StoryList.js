import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import CommentIcon from '@material-ui/icons/Comment';
import UpIcon from '@material-ui/icons/UnfoldMore';

const useStyles = makeStyles(theme => ({
  card: {
    width: '100%',
    float: 'left',
    margin: '10px',
    height: 'auto'
  },
  media: {
    width: '100%'
  },
  mediaDiv: {
    textAlign: 'center'
  },
  cardIcon: {
    color: theme.palette.grey[600]
  },
  cardIconCounter: {
    color: theme.palette.grey[600],
    marginRight: '20px',
    marginLeft: '5px'
  },
  subHeader:{
    color: theme.palette.grey[600]
  },
  parentDiv: {
    width: '50%',
    margin: '0 auto',
    marginTop: '70px'
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function StoryList(props) {
  const classes = useStyles();

  function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  return (
    <div className={classes.parentDiv} >
      {props.items.map(item => (
        <Card 
          className={classes.card}
          key={item.data.id}
          >
          <CardHeader
            avatar={
              <Avatar aria-label={item.data.author} className={classes.avatar}>
                <img alt={item.data.author} src={item.data.thumbnail}></img>
              </Avatar>
            }
            title={item.data.title}
            subheader={
              <a className={classes.subHeader} target='_blank' rel="noopener noreferrer" href={'https://reddit.com/user/' + item.data.author}>{item.data.author}</a>}
          />
          {(item.data.post_hint === 'image') ?
            (
            <img
              className={classes.media}
              src={item.data.url}
              title={item.data.title}
              alt={item.data.title}
            />
            ) : (
            <div className={classes.mediaDiv} dangerouslySetInnerHTML={{ __html : htmlDecode(item.data.secure_media_embed.content) }} />
            )
          }
          <CardActions disableSpacing>
            <UpIcon className={classes.cardIcon}/>
            <p className={classes.cardIconCounter}>{item.data.ups}</p>
            <CommentIcon className={classes.cardIcon}/>
            <p className={classes.cardIconCounter}>{item.data.num_comments}</p>
          </CardActions>
        </Card>
      ))}
    </div>
  );
}