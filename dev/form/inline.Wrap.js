import React from 'react';
import { Form, submit } from './form';
//import { useFyneForm } from '@fyne-ui';

import { Button } from '@material-ui/core'

export const InlineWrap = ({element, ...props}) => {
  //const { FyneForm, data, errors, _submit:submit } = useFyneForm('inline', { Form, submit });

  // const quit = ()=> {
    // done();
  // }
// 
  // const send = () => {
    // console.log('InlineWrap.send', {data, errors});
    // _submit(data);
    // done(data);
  // }

  console.log("InlineWrap",{props})

  return (
    <React.Fragment>
        
      <Form/>
      {/* FyneForm will go here */}
      {/* <FyneForm/> */}

      {/* <Button onClick={event=>send()} color="primary"> */}
        {/* Book Now */}
      {/* </Button> */}

    </React.Fragment>
  );
}