import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
} from "@material-ui/core";
import { Fingerprint, Lock, Email, Person, Phone } from "@material-ui/icons";
import { Alert } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";

import * as Yup from "yup";
import { saveStudent, updateStudent } from "../../api/students";

import "./newUser.css";

export const NewUser = ({
  open,
  handleClose,
  setOpenSnackbar,
  setMessageSnackbar,
  initialValues,
  setLoading,
  setData,
  data,
}) => {
  const {
    values,
    handleChange,
    handleSubmit,
    isValid,
    isSubmitting,
    setSubmitting,
    handleReset,
    errors,
    setErrors,
    setValues,
  } = useFormik({
    initialValues: {
      id: !!initialValues.id ? initialValues.id : "",
      identityDocument: !!initialValues.identityDocument
        ? initialValues.identityDocument
        : "",
      firstName: !!initialValues.firstName ? initialValues.firstName : "",
      lastName: !!initialValues.lastName ? initialValues.lastName : "",
      password: "",
      email: !!initialValues.email ? initialValues.email : "",
      phone: !!initialValues.phone ? initialValues.phone : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      identityDocument: Yup.string().required("Requerido"),
      firstName: Yup.string().required("Requerido"),
      lastName: Yup.string().required("Requerido"),
      password: Yup.string(),
      email: Yup.string()
        .email("Debe ser un email valido")
        .required("Requerido"),
      phone: Yup.string().required("Requerido"),
    }),
    onSubmit: (values) => {
      setSubmitting(false);
      if (!!initialValues.id) {
        updateStudent(values)
          .then((response) => {
            if (response.status === 400) {
              setErrors(response.errors);
            }
            if (response.status === 201) {
              handleClose();
              handleReset();
              setOpenSnackbar(true);
              setMessageSnackbar("Estudiante modificado correctamente!");
              // setLoading(true);
              const newData = data.map((item) => {
                if (item.id === values.id) {
                  return response.usuario;
                }
                return item;
              });
              setData(newData);
            }
          })
          .catch((err) => {
            console.clear();
            console.log("ERROR", err);
          });
      } else {
        saveStudent(values)
          .then((data) => {
            if (data.status === 400) {
              setErrors(data.errors);
            }
            if (data.status === 201) {
              handleClose();
              handleReset();
              setOpenSnackbar(true);
              setMessageSnackbar("Estudiante agregado correctamente!");
              setLoading(true);
            }
          })
          .catch((err) => {
            console.clear();
            console.log("ERROR", err);
          });
      }
    },
  });

  const onPressHandleClose = () => {
    setValues({
      id: "",
      identityDocument: "",
      firstName: "",
      lastName: "",
      password: "",
      email: "",
      phone: "",
    });
    setErrors({});
    handleClose();
  };

  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        onClose={onPressHandleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {!!initialValues.id ? "Modificar" : "Agregar"} Estudiante
        </DialogTitle>
        <DialogContent dividers>
          <div className="textFieldItem">
            <Fingerprint className="textFieldIconItem" />
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
          <div className="textFieldItem">
            <Person className="textFieldIconItem" />
            <TextField
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              error={errors.firstName}
              helperText={errors.firstName}
              id="firstName"
              label="Nombre"
              onChange={handleChange}
              value={values.firstName}
            />
          </div>
          <div className="textFieldItem">
            <Person className="textFieldIconItem" />
            <TextField
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              error={errors.lastName}
              helperText={errors.lastName}
              id="lastName"
              label="Apellido"
              onChange={handleChange}
              value={values.lastName}
            />
          </div>
          <div className="textFieldItem">
            <Email className="textFieldIconItem" />
            <TextField
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              error={errors.email}
              helperText={errors.email}
              id="email"
              label="Correo Electrónico"
              onChange={handleChange}
              value={values.email}
            />
          </div>
          <div className="textFieldItem">
            <Phone className="textFieldIconItem" />
            <TextField
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              error={errors.phone}
              helperText={errors.phone}
              id="phone"
              label="Teléfono"
              onChange={handleChange}
              value={values.phone}
            />
          </div>
          <div className="textFieldItem">
            <Lock className="textFieldIconItem" />
            <TextField
              fullWidth
              type="password"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              helperText="Si deja la contraseña en blanco, se establecera la cedula como contraseña"
              id="password"
              label="Contraseña"
              onChange={handleChange}
              value={values.password}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            size="large"
            variant="text"
            color="primary"
            disabled={!isValid || isSubmitting}
            onClick={handleSubmit}
          >
            {!!initialValues.id ? "Modificar" : "Registrar"}
          </Button>
          <Button
            size="large"
            variant="text"
            color="primary"
            onClick={onPressHandleClose}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
