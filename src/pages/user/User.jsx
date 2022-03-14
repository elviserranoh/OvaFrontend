import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import {
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from "@material-ui/icons";
import { Button, Snackbar, TextField } from "@material-ui/core";
import { Alert } from "@mui/material";

import {
  findStudentById,
  updateStudent,
  updateImageProfile,
} from "../../api/students";

import "./user.css";

import { URL_API } from "../../api/constants";
import { useDispatch } from "react-redux";
import { updateProfile, setImageProfile } from "../../duck/auth";

const defaultImageSrc = "/img/img_profile.jpg";

export const UserProfile = () => {
  const dispatch = useDispatch();

  const [initialValues, setInitialValues] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [messageSnackbar, setMessageSnackbar] = useState("");
  const [severity, setSeverity] = useState("success");

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
      updateStudent(values)
        .then((response) => {
          if (response.status === 400) {
            setErrors(response.errors);
          }
          if (response.status === 201) {
            handleReset();
            setOpenSnackbar(true);
            setInitialValues(response.usuario);
            setMessageSnackbar("Datos modificados correctamente!");

            const usuario = {
              firstName: response.usuario.firstName,
              lastName: response.usuario.lastName,
            };

            dispatch(updateProfile(usuario));

            let userLocalStorage = JSON.parse(localStorage.getItem("usuario"));

            const updateLocalStorage = {
              ...userLocalStorage,
              ...usuario,
              image: initialValues.image,
            };

            localStorage.removeItem("usuario");
            localStorage.setItem("usuario", JSON.stringify(updateLocalStorage));
          }
        })
        .catch((err) => {
          console.clear();
          console.log("ERROR", err);
        });
    },
  });

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const validateTypeImage = (type) => {
    switch (type) {
      case "image/png":
      case "image/jpeg":
        return;
      default:
        throw new Error("Formato de imagen no valido, jpg y png unicamente");
    }
  };

  const updateImage = (imageTargetFile) => {
    const formData = new FormData();
    formData.append("imageFile", imageTargetFile);

    updateImageProfile(initialValues.id, formData)
      .then((response) => {
        if (response.status === 400) {
          throw new Error("Error, no se pudo actualizar la imagen de perfil");
        }
        if (response.status === 200) {
          setSeverity("success");
          setOpenSnackbar(true);
          setMessageSnackbar(
            `Imagen de perfil se ha actualizado correctamente!`
          );

          dispatch(
            setImageProfile({
              image: response.data,
            })
          );

          setInitialValues({
            ...initialValues,
            image: response.data,
          });
        }
      })
      .catch((err) => {
        setSeverity("error");
        setOpenSnackbar(true);
        setMessageSnackbar(
          `No se pudo actualizar la imagen de perfil, vuelva a intentarlo.`
        );
      });
  };

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("usuario")).id;

    findStudentById(userId).then((data) => {
      setInitialValues(data);
    });
  }, []);

  return (
    <>
      <div className="user">
        <div className="userTitleContainer">
          <h1 className="userTitle">Mi Perfil</h1>
        </div>
        <div className="userContainer">
          <div className="userShow">
            <div className="userShowTop">
              <img
                src={
                  !!initialValues.image
                    ? `${URL_API}/api/ova/image/${initialValues.image}`
                    : defaultImageSrc
                }
                alt=""
                className="userShowImg"
              />
              <div className="userShowTopTitle">
                <span className="userShowUsername">{`${initialValues.firstName} ${initialValues.lastName}`}</span>
                <span className="userShowUserTitle">
                  {initialValues.rol === "ROLE_ADMIN" && `Administrador`}
                </span>
              </div>
            </div>
            <div className="userShowBottom">
              <span className="userShowTitle">Detalles de la cuenta</span>
              <div className="userShowInfo">
                <PermIdentity className="userShowIcon" />
                <span className="userShowInfoTitle">
                  {initialValues.identityDocument}
                </span>
              </div>
              <div className="userShowInfo">
                <PhoneAndroid className="userShowIcon" />
                <span className="userShowInfoTitle">{initialValues.phone}</span>
              </div>
              <div className="userShowInfo">
                <MailOutline className="userShowIcon" />
                <span className="userShowInfoTitle">{initialValues.email}</span>
              </div>
            </div>
          </div>
          <div className="userUpdate">
            <span className="userUpdateTitle">Editar</span>
            <div className="userUpdateForm">
              <div className="userUpdateLeft">
                <div className="userUpdateItem">
                  <TextField
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
                <div className="userUpdateItem">
                  <TextField
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
                <div className="userUpdateItem">
                  <TextField
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
                <div className="userUpdateItem">
                  <TextField
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
                <div className="userUpdateItem">
                  <TextField
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
                <div className="userUpdateItem">
                  <TextField
                    fullWidth
                    type="password"
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText="Si deja la contraseña en blanco, permanecerá la actual"
                    id="password"
                    label="Contraseña"
                    onChange={handleChange}
                    value={values.password}
                  />
                </div>
                <div className="userUpdateItem">
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isValid || isSubmitting}
                    onClick={handleSubmit}
                  >
                    Actualizar Datos
                  </Button>
                </div>
              </div>
              <div className="userUpdateRight">
                <div className="userUpdateUpload">
                  <img
                    className="userUpdateImg"
                    src={
                      !!initialValues.image
                        ? `${URL_API}/api/ova/image/${initialValues.image}`
                        : defaultImageSrc
                    }
                    alt=""
                  />
                  <label htmlFor="file">
                    <Button
                      variant="text"
                      component="label"
                      startIcon={<Publish />}
                    >
                      <input
                        name="image"
                        accept="image/*"
                        id="contained-button-file"
                        type="file"
                        hidden
                        onChange={(e) => {
                          try {
                            let imageTargetFile = e.target.files[0];
                            validateTypeImage(imageTargetFile.type);
                            updateImage(imageTargetFile);
                          } catch (error) {
                            setSeverity("warning");
                            setOpenSnackbar(true);
                            setMessageSnackbar(error);
                          }
                        }}
                      />
                    </Button>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
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
