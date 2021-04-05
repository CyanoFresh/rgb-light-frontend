import React, { useContext, useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Controller from './Controller';
import InputBase from '@material-ui/core/InputBase';
import { useLocalStorage } from './hooks';
import Wifi from '@material-ui/icons/Wifi';
import WifiOff from '@material-ui/icons/WifiOff';
import { DeviceStateContext, DeviceStateContextProvider } from './deviceStateContext';
import BatteryChargingFullIcon from '@material-ui/icons/BatteryChargingFull';

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
    minHeight: '100vh',
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
    width: '100%',
  },
  batteryLevel: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 6),
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  searchIcon: {
    width: theme.spacing(6.5),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function TopMenu({ deviceUrl, onUrlChange, online }) {
  const classes = useStyles();
  const [state] = useContext(DeviceStateContext);

  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            {online ? <Wifi /> : <WifiOff />}
          </div>
          <InputBase
            placeholder='Device URL…'
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            value={deviceUrl}
            onChange={onUrlChange}
          />
        </div>
        {Boolean(state.batteryLevel) && (
          <div className={classes.batteryLevel}>
            <BatteryChargingFullIcon />
            {state.batteryLevel}%
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

function App() {
  const classes = useStyles();
  const [isOnline, setIsOnline] = useState(false);
  const [deviceUrl, setDeviceUrl] = useLocalStorage('device_url', 'http://192.168.4.1/');

  return (
    <DeviceStateContextProvider>
      <CssBaseline />
      <div className={classes.root}>
        <TopMenu online={isOnline} deviceUrl={deviceUrl} onUrlChange={(e) => setDeviceUrl(e.target.value)} />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Controller url={deviceUrl} isOnline={isOnline} setIsOnline={setIsOnline} />
        </main>
      </div>
    </DeviceStateContextProvider>
  );
}

export default App;
