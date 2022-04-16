import { useCallback } from 'react';
import { Typography, Box,TextField } from '@mui/material';
import { useLocation } from 'react-router';
import { useAppUser } from '../hooks/useAppUser';
import { Controller, useForm } from 'react-hook-form';

import { PageTitle } from '../components/PageTitle';
//import { Email } from '@mui/icons-material';

export const Login = () => {

  const {operations} = useAppUser();
  const [loginHandler, loginRequest] = operations.login;

  const location = useLocation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = useCallback((values) => {
    loginHandler({variables: values})
    reset();
}, []);

const fields = [
    {
        label: 'Email',
        name: 'email',
        type: 'email'
    },
    {
        label: 'Password',
        name: 'password',
        type: 'password'
    }
]
    
  return (
    <>
      <PageTitle title={location.pathname.replaceAll('/', ' ').trimStart()} />
      <Box sx={{ p: 3 }}>
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
          imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
          velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate eu
          scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt
          lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
          ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
        
        {fields.map((item) => (
           <Controller
           render={({ field: { name, value, onChange } }) => (
               <TextField
                   name={name}
                   value={value}
                   onChange={onChange}
                   label={item.label}
                   error={Boolean(errors[item.name])}
                   helperText={errors[item.name] ? errors[item.name].message : ''}
               />
           )}
           control={control}
           name={item.name}
           defaultValue=""
           rules={{ required: { value: true, message: 'Invalid input' } }}
       />
        ))}
       
      <input type="submit" />
    </form>
      </Box>
    </>
  );
};
