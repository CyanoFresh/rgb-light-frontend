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
}));

const URL = 'http://localhost/';

function Controller() {
  const classes = useStyles();
  const [isConnected, setIsConnected] = useState(false);
  const [kelvin, setKelvin] = useState(3000);
  const [data, setData] = useState({
    resolution: 10,
    name: null,
    color: {
      r: 0,
      g: 0,
      b: 0,
    },
  });

  const colorToDevice = (color) => {
    const result = { ...color.rgb };

    if (data.resolution === 10) {
      result.r *= 4;
      result.g *= 4;
      result.b *= 4;
    }

    return result;
  };

  const colorFromDevice = (r, g, b) => {
    const color = { r, g, b };

    if (data.resolution === 10) {
      color.r /= 4;
      color.g /= 4;
      color.b /= 4;
    }

    return color;
  };

  const handleResponse = (response) => {
    let [resolution, name, r, g, b] = response.split(',');

    resolution = parseInt(resolution);
    r = parseInt(r);
    g = parseInt(g);
    b = parseInt(b);

    setData({
      resolution,
      name,
      color: colorFromDevice(r, g, b),
    });
  };

  useEffect(() => {
    const load = async () => {
      const controller = new AbortController();
      const signal = controller.signal;

      setTimeout(() => controller.abort(), 1900);

      try {
        const response = await fetch(URL, { signal });

        setIsConnected(true);

        handleResponse(await response.text());
      } catch (e) {
        console.log('Request failed: ', e.message);

        setIsConnected(false);
      }
    };

    const timer = setInterval(load, 10000);

    load();

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleChange = async (color) => {
    const { r, g, b } = colorToDevice(color);

    try {
      const response = await fetch(`${URL}?r=${r}&g=${g}&b=${b}`, {
        method: 'POST',
      });

      setIsConnected(true);

      handleResponse(await response.text());
    } catch (e) {
      console.log('Change failed: ', e.message);
      setIsConnected(false);
    }
  };

  if (!isConnected) {
    return (
      <div>
        <div><CircularProgress size={100} thickness={2.5}/></div>
        <Box><p>To control the stand, connect to the Wi-Fi Access Point</p></Box>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h5" component="h3" className={classes.name}>
        {data.name}
      </Typography>

      <Grid container spacing={2}>
        <Grid item lg={3} xs={12} className={classes.centerParent}>
          <ChromePicker
            color={data.color}
            onChangeComplete={handleChange}
          />
        </Grid>
        <Grid item lg={3} xs={12}>
          <Paper className={classes.paper}>
            <Typography id="kelvin-slider-label" gutterBottom>
              HUE
            </Typography>
            <HuePicker
              color={data.color}
              onChangeComplete={handleChange}
            />
          </Paper>
        </Grid>
        <Grid item lg={3} xs={12}>
          <Paper className={classes.paper}>
            <Typography id="kelvin-slider-label" gutterBottom>
              Temperature, K
            </Typography>
            <Slider
              value={kelvin}
              min={2000}
              max={10000}
              defaultValue={3500}
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
