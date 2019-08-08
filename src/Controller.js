import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { ChromePicker, HuePicker } from 'react-color';
import Grid from '@material-ui/core/Grid';
import kelvinToRgb from 'kelvin-to-rgb';
import Slider from '@material-ui/core/Slider';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  loadingWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(2, 3),
  },
  name: {
    marginBottom: theme.spacing(1),
  },
  centerParent: {
    display: 'flex',
    alignItems: 'center',
  },
  loadingParent: {
    textAlign: 'center',
    padding: theme.spacing(5, 0),
  },
}));

function Controller({ url, setIsOnline }) {
  const classes = useStyles();
  const [isConnected, setIsConnected] = useState(false);
  const [kelvin, setKelvin] = useState(3000);
  const [color, setColor] = useState({
    r: 0,
    g: 0,
    b: 0,
  });

  const colorToDevice = (color) => {
    const result = { ...color.rgb };

    result.r *= 4;
    result.g *= 4;
    result.b *= 4;

    return result;
  };

  const colorFromDevice = (r, g, b) => {
    const color = { r, g, b };

    color.r /= 4;
    color.g /= 4;
    color.b /= 4;

    return color;
  };

  const handleResponse = (response) => {
    let [r, g, b] = response.split(',');

    r = parseInt(r);
    g = parseInt(g);
    b = parseInt(b);

    setColor(colorFromDevice(r, g, b));
  };

  useEffect(() => {
    const load = async () => {
      const controller = new AbortController();
      const signal = controller.signal;

      setTimeout(() => controller.abort(), 1900);

      try {
        const response = await fetch(url, { signal });

        setIsConnected(true);
        setIsOnline(true);

        handleResponse(await response.text());
      } catch (e) {
        console.log('Request failed: ', e.message);

        setIsOnline(false);
        setIsConnected(false);
      }
    };

    const timer = setInterval(load, 10000);

    load();

    return () => {
      clearTimeout(timer);
    };
  }, [url]);

  const handleChange = async (color) => {
    const { r, g, b } = colorToDevice(color);

    try {
      const response = await fetch(`${url}?r=${r}&g=${g}&b=${b}`, {
        method: 'POST',
      });

      setIsConnected(true);
      setIsOnline(true);

      handleResponse(await response.text());
    } catch (e) {
      console.log('Change request failed: ', e.message);
      setIsConnected(false);
      setIsOnline(false);
    }
  };

  if (!isConnected) {
    return (
      <div className={classes.loadingParent}>
        <div><CircularProgress size={100} thickness={2.5}/></div>
        <Box>
          <p>Connect to the Device's Wi-Fi Access Point (RGB Light xx)</p>
        </Box>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h5" component="h3" className={classes.name}>
        RGB Stand
      </Typography>

      <Grid container spacing={2}>
        <Grid item lg={3} sm={6} xs={12} className={classes.centerParent}>
          <ChromePicker
            color={color}
            onChangeComplete={handleChange}
          />
        </Grid>
        <Grid item lg={3} sm={6} xs={12}>
          <Paper className={classes.paper}>
            <Typography id="kelvin-slider-label" gutterBottom>
              HUE
            </Typography>
            <HuePicker
              color={color}
              onChangeComplete={handleChange}
            />
          </Paper>
        </Grid>
        <Grid item lg={3} sm={6} xs={12}>
          <Paper className={classes.paper}>
            <Typography id="kelvin-slider-label" gutterBottom>
              Temperature, K
            </Typography>
            <Slider
              value={kelvin}
              min={100}
              max={8000}
              defaultValue={3000}
              step={100}
              valueLabelDisplay="auto"
              getAriaValueText={(value) => `${value} K`}
              onChange={(e, value) => setKelvin(value)}
              onChangeCommitted={(e, value) => {
                const [r, g, b] = kelvinToRgb(value);

                return handleChange({
                  rgb: {
                    r, g, b,
                  },
                });
              }}
              aria-labelledby="kelvin-slider-label"
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Controller;
