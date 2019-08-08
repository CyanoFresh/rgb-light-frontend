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
  loadingParent: {
    textAlign: 'center',
    padding: theme.spacing(5, 0),
  },
  chroma: {
    boxShadow: theme.shadows[1] + ' !important',
  },
}));

const colorToDevice = (color) => ({
  r: color.rgb.r * 4,
  g: color.rgb.g * 4,
  b: color.rgb.b * 4,
});

const colorFromDevice = (r, g, b) => ({
  r: r / 4,
  g: g / 4,
  b: b / 4,
});

const responseToColor = (response) => {
  const [r, g, b] = response.split(',');

  return colorFromDevice(+r, +g, +b);
};

function Controller({ url, setIsOnline, isOnline }) {
  const classes = useStyles();
  const [kelvin, setKelvin] = useState(3000);
  const [color, setColor] = useState({
    r: 0,
    g: 0,
    b: 0,
  });

  useEffect(() => {
    const load = async () => {
      const controller = new AbortController();
      const signal = controller.signal;

      // Cancel request if there is no response
      setTimeout(() => controller.abort(), 1900);

      try {
        const response = await fetch(url, { signal });
        const responseString = await response.text();
        const color = responseToColor(responseString);

        setIsOnline(true);
        setColor(color);
      } catch (e) {
        console.log('Request failed: ', e.message);
        setIsOnline(false);
      }
    };

    const timer = setInterval(load, 10000);

    load();

    return () => clearTimeout(timer);
  }, [url, setIsOnline]);

  const handleChange = async (color) => {
    const { r, g, b } = colorToDevice(color);

    try {
      const response = await fetch(`${url}?r=${r}&g=${g}&b=${b}`, {
        method: 'POST',
      });
      const responseString = await response.text();
      const color = responseToColor(responseString);

      setIsOnline(true);
      setColor(color);
    } catch (e) {
      console.log('Change request failed: ', e.message);
      setIsOnline(false);
    }
  };

  if (!isOnline) {
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
    <Grid container spacing={2}>
      <Grid item lg={3} sm={6} xs={12}>
        <ChromePicker
          width={'100%'}
          className={classes.chroma}
          color={color}
          onChangeComplete={handleChange}
          disableAlpha
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
            min={600}
            max={9000}
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
  );
}

export default Controller;
