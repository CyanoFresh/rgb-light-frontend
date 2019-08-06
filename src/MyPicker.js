import React from 'react';
import { CustomPicker } from 'react-color';
import { Saturation } from 'react-color/lib/components/common';
import withStyles from '@material-ui/core/styles/withStyles';

class MyColorPicker extends React.Component {
  render() {
    return <div className={this.props.classes.root}>
      <Saturation
        {...this.props}/>
    </div>;
  }
}

export default withStyles({
  root: {
    position: 'relative',
    height: 300,
  },
})(CustomPicker(MyColorPicker));
