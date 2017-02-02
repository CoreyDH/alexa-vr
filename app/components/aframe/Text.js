import React from 'react';
import {Entity} from 'aframe-react';

export default props => {
  const extraProps = AFRAME.utils.extend({}, props);
  delete extraProps.color;
  delete extraProps.text;

  return <Entity
    bmfont-text={{text: props.text, color: props.color || black}} material={{color: props.color}}
    {...extraProps}/>
};
