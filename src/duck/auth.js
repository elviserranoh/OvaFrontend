import { URL_API } from "../api/constants";

const AUTH_LOGIN = "[Auth] Login";
const AUTH_SET_IMAGE_PROFILE = "[Auth] Image Profile";
const AUTH_UPDATE_PROFILE = "[Auth] Update Profile";
const AUTH_LOGOUT = "[Auth] Logout";
const AUTH_ERROR = "[Auth] Error";

const initialState = {
  isAuthenticated: false,
  rol: "",
};

export const authReducers = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOGIN:
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
      };
    case AUTH_UPDATE_PROFILE:
      return {
        ...state,
        ...action.payload,
      };
    case AUTH_SET_IMAGE_PROFILE:
      return {
        ...state,
        image: action.payload.image,
      };
    case AUTH_LOGOUT:
      return {
        isAuthenticated: false,
      };
    case AUTH_ERROR:
      return {
        message_error: action.payload,
      };
    default:
      return state;
  }
};

export const setAuthentication = (payload) => ({
  type: AUTH_LOGIN,
  payload,
});

export const setImageProfile = (payload) => ({
  type: AUTH_LOGIN,
  payload,
});

export const updateProfile = (payload) => ({
  type: AUTH_UPDATE_PROFILE,
  payload,
});

export const setLogout = () => ({
  type: AUTH_LOGOUT,
});

export const setAuthError = (payload) => ({
  type: AUTH_ERROR,
  payload,
});

// Middleware
export const startLogoutAuth = () => {
  return (dispatch) => {
    localStorage.clear();
    dispatch(setLogout());
  };
};

export const startLoginAuth = ({ username, password, grant_type }) => {
  return async (dispatch) => {
    try {
      let params = new URLSearchParams();
      params.set("grant_type", "password");
      params.set("username", username);
      params.set("password", password);

      console.clear();
      console.log(params.toString);

      const resp = await fetch(`${URL_API}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa("universidad_app:123456")}`,
        },
        body: params.toString(),
      });

      if (resp.status === 400) {
        dispatch(
          setAuthError("Documento de identidad o Contrasena Incorrecto")
        );
      }

      if (resp.ok) {
        const result = await resp.json();
        commonAuthenticationUser(dispatch, result);
      }
    } catch (error) {
      console.log("me estoy ejecutando", error);
    }
  };
};

const commonAuthenticationUser = (dispatch, result) => {
  const {
    id,
    firstName,
    lastName,
    identityDocument,
    image,
    rol,
    expires_in,
    access_token,
    refresh_token,
  } = result;

  const horaExpiraMs = expires_in * 1000;
  const fechaActualMs = new Date().getTime();
  const fechaExpiraMs = fechaActualMs + horaExpiraMs;

  const usuario = {
    id,
    firstName,
    lastName,
    identityDocument,
    image,
    rol,
    expires_in,
    access_token,
    isAuthenticated: true,
  };

  if (rol === "ROLE_ADMIN") {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("token_expires_in", fechaExpiraMs);

    dispatch(setAuthentication(usuario));
  } else {
    dispatch(setAuthError("No tiene permisos para acceder al administrador"));
  }
};
