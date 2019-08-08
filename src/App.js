import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { fade, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Controller from './Controller';
import InputBase from '@material-ui/core/InputBase';
import { useLocalStorage } from './hooks';
import Wifi from '@material-ui/icons/Wifi';
import WifiOff from '@material-ui/icons/WifiOff';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
    fontFamily: 'Product Sans',
    fontWeight: 400,
    whiteSpace: 'nowrap',
    wordBreak: 'keep-all',
    marginRight: theme.spacing(),
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    padding: theme.spacing(1),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  toolbar: theme.mixins.toolbar,
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 6),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 160,
      '&:focus': {
        width: 210,
      },
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function App() {
  const classes = useStyles();
  const [isOnline, setIsOnline] = useState(false);
  const [deviceUrl, setDeviceUrl] = useLocalStorage('device_url', 'http://192.168.4.1/');

  return (
    <div className={classes.root}>
      <CssBaseline/>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon/>
          </IconButton>

          <Typography variant="h6" className={classes.title}>
            RGB-Light
          </Typography>

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              {isOnline ? <Wifi/> : <WifiOff/>}
            </div>
            <InputBase
              placeholder="Device URL…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              value={deviceUrl}
              onChange={(e) => setDeviceUrl(e.target.value)}
            />
          </div>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.toolbar}/>
        <Controller url={deviceUrl} isOnline={isOnline} setIsOnline={setIsOnline}/>
      </main>
    </div>
  );
}

export default App;
