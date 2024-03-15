import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
  UPDATE_USER: 'UPDATE_USER' // New action type
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  },
  [HANDLERS.UPDATE_USER]: (state, action) => {
    const updatedUser = action.payload;

    return {
      ...state,
      user: updatedUser
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = window.sessionStorage.getItem('authenticated') === 'true';
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      const user = window.sessionStorage.getItem('user');

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: JSON.parse(user)
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );


  const signIn = async (username, password) => {
    try {
      const response = await fetch('https://api.tcgsync.com:4000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json()
      if (data.success == 1) {
        const user = await data.data.user;
        const accessToken = await data.data.accessToken;
        try {
          window.sessionStorage.setItem('authenticated', 'true');
          window.sessionStorage.setItem('user', JSON.stringify({...user, accessToken: accessToken}));
        } catch (err) {
          console.error(err);
        }
  
        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: {...user, accessToken: accessToken}
        });
      } else {
        throw new Error('Please check your email and password');
      }
    } catch (err) {
      console.error(err);
      throw err; // Re-throw the error for further handling if needed
    }
  };
  

  const signUp = async (email, name, password) => {
    throw new Error('Sign up is not implemented');
  };

  const signOut = () => {
     window.sessionStorage.setItem('user', JSON.stringify({}));
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  const updateUser = (updatedUser) => {
    try {
      // Retrieve the current user from sessionStorage
      const currentUser = JSON.parse(window.sessionStorage.getItem('user'));
      // Merge the updatedUser with the currentUser
      const mergedUser = { ...currentUser, ...updatedUser };
      // Update sessionStorage with the merged user object
      window.sessionStorage.setItem('user', JSON.stringify(mergedUser));
    } catch (err) {
      console.error(err);
    }
  
    dispatch({
      type: HANDLERS.UPDATE_USER,
      payload: updatedUser
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
