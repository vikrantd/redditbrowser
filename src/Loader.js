import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  loaderDiv: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'center',
    margin: '50px 0'
  },
  loader: {
      width: '100px !important',
      height: '100px !important'
  },
  hidden: {
      display: 'none'
  }
}));

export default function Loader(props) {
  const classes = useStyles();

  return (
    <div className={(props.loading) ? classes.loaderDiv : classes.hidden} hidden={!props.loading}>
        <CircularProgress className={classes.loader} />
    </div>
  );
}
