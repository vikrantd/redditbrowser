import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    position: 'fixed',
    zIndex: 1,
    top: 0,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Navigation(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
        >
          {props.items.map(item => (
          <Tab
            label={item.title}
            key={item.id}
            onClick={() => {
              props.itemSelected(item);
            }}
          />
          ))}
        </Tabs>
      </AppBar>
    </div>
  );
}
