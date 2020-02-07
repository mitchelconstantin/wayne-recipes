import React, { useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import { logIn } from '../Shared/AppBehaviors';
import { emptyUser, IUser } from '../Shared/Types';
import SnackbarService from '../Shared/SnackbarService';
import { UserAPI } from '../Shared/UserAPI';

export const Login = () => {
  const [user, setUser] = useState(emptyUser);

  const handleChange = (type: string, newValue: any) => {
    setUser(prev => ({ ...prev, [type]: newValue }));
  };

  const handleLoginClick = async () => {
    try {
      const response = await UserAPI.loginToServer(user);
      if (response.status === 400) {
        SnackbarService.error('yikes, that user does not exist');
        setUser(emptyUser);
      }
      if (response.status === 200) {
        const u = await response.json();
        setUser(u);
        logIn(u);
        window.location.href = '/all';
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };
  return (
    <>
      <TextField
        label="Email"
        required
        value={user.email}
        onChange={e => handleChange('email', e.target.value)}
        margin="normal"
      />
      <TextField
        id="standard-password-input"
        label="Password"
        onChange={e => handleChange('password', e.target.value)}
        type="password"
        value={user.password}
        required
        autoComplete="current-password"
        margin="normal"
      />

      <>
        <Button
          onClick={handleLoginClick}
          disabled={!(user.email && user.password)}
          variant="contained"
          color="primary"
        >
          Login
        </Button>
        <Button href="/signup" variant="contained" color="primary">
          click here to sign up
        </Button>
      </>
    </>
  );
};
