import { useFormik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";

import TextField from "@material-ui/core/TextField";

import "./forgotPassword.css";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { recoveryPassword } from "../../api/students";

export const ForgotPassword = () => {
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
      identityDocument: "23805156",
    },
    validationSchema: Yup.object().shape({
      identityDocument: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      setSubmitting(false);
      recoveryPassword(values.identityDocument).then((response) => {
        console.clear();
        console.log(response);
      });
    },
  });

  return (
    <div className="login">
      <div className="loginRight">
        <div className="loginRightTitle">Estructuras Discretas</div>
      </div>

      <div className="loginLeft">
        <form>
          <div className="loginLeftContainer">
            <h1 className="loginLeftTitle">Recuperar Contraseña</h1>
            <p className="loginLeftSubtitle">
              Bienvenido al administrador de los OVA de Estructuras Discretas
            </p>
            <div className="loginLeftItem">
              <TextField
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                error={errors.identityDocument}
                helperText={errors.identityDocument}
                id="identityDocument"
                label="Documento de identidad"
                onChange={handleChange}
                value={values.identityDocument}
              />
            </div>
            <div className="loginLeftButton">
              <Button
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
              >
                Recuperar Contraseña
              </Button>
            </div>
            <div className="loginLeftRecoverPassword">
              <Link to="/login">Iniciar Sesión</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
