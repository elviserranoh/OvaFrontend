import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

import TextField from "@material-ui/core/TextField";

import "./auth.css";
import { Button, Snackbar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { startLoginAuth, setAuthError } from "../../duck/auth";
import { Alert } from "@mui/material";

export const Auth = () => {
  const dispatch = useDispatch();
  const { message_error, isAuthenticated } = useSelector((state) => state.auth);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [messageSnackbar, setMessageSnackbar] = useState("");
  const [severity, setSeverity] = useState("success");

  useEffect(() => {
    if (!!message_error) {
      setSeverity("error");
      setMessageSnackbar(message_error);
      setOpenSnackbar(true);
      dispatch(setAuthError(""));
    }
  }, [message_error, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      setSeverity("success");
      setMessageSnackbar("Bienvenido");
      setOpenSnackbar(true);
    }
  }, [isAuthenticated]);

  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    isValid,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    initialValues: {
      username: "23805156",
      password: "123456",
      grant_type: "password",
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Required"),
      password: Yup.string()
        .min(4, "Password is to short - should be 4 chars minimun.")
        .required("Required"),
    }),
    onSubmit: (values) => {
      setSubmitting(false);
      dispatch(startLoginAuth(values));
    },
  });

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <div className="login">
        <div className="loginRight">
          <div className="loginRightTitle">Estructuras Discretas</div>
        </div>

        <div className="loginLeft">
          <form onSubmit={handleSubmit}>
            <div className="loginLeftContainer">
              <h1 className="loginLeftTitle">ADMINISTRADOR</h1>
              <p className="loginLeftSubtitle">
                Bienvenido al administrador de los OVA de Estructuras Discretas
              </p>
              <div className="loginLeftError">
                {/* {message_error && (
                  <div className="alert alert-danger">
                    {message_error}
                  </div>
                )} */}
              </div>
              <div className="loginLeftItem">
                <TextField
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={errors.username}
                  helperText={errors.username}
                  id="username"
                  label="Documento de Identidad"
                  onChange={handleChange}
                  value={values.username}
                />
              </div>
              <div className="loginLeftItem">
                <TextField
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={errors.password}
                  helperText={errors.password}
                  type={"password"}
                  id="password"
                  label="Contraseña"
                  onChange={handleChange}
                  value={values.password}
                />
              </div>
              <div className="loginLeftButton">
                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                  color="primary"
                  disabled={!isValid || isSubmitting}
                >
                  Iniciar Sesión
                </Button>
              </div>
              <div className="loginLeftRecoverPassword">
                <Link to="/forgotPassword">Recuperar Contraseña</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Alert onClose={handleSnackbarClose} severity={severity}>
          {messageSnackbar}
        </Alert>
      </Snackbar>
    </>
  );
};
