import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { CloudUploadOutlined, Delete, LibraryBooks } from "@material-ui/icons";
import { useFormik } from "formik";

import DatePicker from "@mui/lab/DatePicker";

import { fetchAll } from "../../api/ovas";

import * as Yup from "yup";
import { URL_API } from "../../api/constants";
import { save, update } from "../../api/documents";

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import AdapterDateFns from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import "./style.css";
import { useEffect, useState } from "react";
import {
  Avatar,
  FormHelperText,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

const defaultImageSrc = "/img/image_placeholder.png";

export const NewDocument = ({
  open,
  handleClose,
  setOpenSnackbar,
  setMessageSnackbar,
  initialValues,
  setLoading,
  setSeverity,
  data,
  setData,
}) => {
  const [ovas, setOvas] = useState([]);
  // const [contents, setContents] = useState([]);

  useEffect(() => {
    findAllOvas();
  }, []);

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
    setFieldValue,
  } = useFormik({
    initialValues: {
      id: !!initialValues.id ? initialValues.id : "",
      ova: !!initialValues.ova ? initialValues.ova : "",
      title: !!initialValues.title ? initialValues.title : "",
      year: !!initialValues.year ? initialValues.year : "",
      autor: !!initialValues.autor ? initialValues.autor : "",
      presentation: !!initialValues.presentation
        ? initialValues.presentation
        : "",
      url: !!initialValues.url ? initialValues.url : "",
      imageSrc: !!initialValues.image
        ? `${URL_API}/api/ova/image/${initialValues.image}`
        : defaultImageSrc,
      imageFile: null,
      documentFile: null,
      documentSrc: !!initialValues.document ? initialValues.document : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      ova: Yup.string().required("Requerido"),
      title: Yup.string().required("Requerido"),
      year: Yup.string().nullable().required("Requerido"),
      autor: Yup.string().required("Requerido"),
      presentation: Yup.string(),
      url: Yup.string(),
    }),
    onSubmit: (values) => {
      setSubmitting(false);

      const formData = new FormData();
      formData.append("ovaId", values.ova);
      formData.append("title", values.title);
      formData.append("year", values.year);
      formData.append("autor", values.autor);
      formData.append("presentation", values.presentation);
      formData.append("url", values.url);

      if (!!values.imageFile) {
        formData.append("imageFile", values.imageFile);
      }

      if (!!values.documentFile) {
        formData.append("documentFile", values.documentFile);
      }

      if (!!initialValues.id) {
        formData.append("id", values.id);

        update(values.id, formData)
          .then((response) => {
            if (response.status === 400) {
              setErrors(response.errors);
            }
            if (response.status === 200) {
              handleClose();
              handleReset();
              setOpenSnackbar(true);
              setMessageSnackbar(`Documento modificado correctamente!`);
              setLoading(true);
            }
          })
          .catch((err) => {
            console.log("ERROR", err);
          });
      } else {
        save(formData)
          .then((data) => {
            if (data.status === 400) {
              setErrors(data.errors);
            }
            if (data.status === 201) {
              handleClose();
              handleReset();
              setOpenSnackbar(true);
              setMessageSnackbar(`Documento agregado correctamente!`);
              setLoading(true);
            }
          })
          .catch((err) => {
            console.log("ERROR", err);
          });
      }
    },
  });

  const validateTypeImage = (type) => {
    switch (type) {
      case "image/png":
      case "image/jpeg":
      case "application/pdf":
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/application/vnd.openxmlformats-officedocument.wordprocessingml.template":
      case "application/vnd.ms-excel":
      case " application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      case "application/vnd.ms-powerpoint":
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        return;
      default:
        throw "Formato no valido, jpg, png, pdf, word, excel, powerpoint unicamente";
    }
  };

  const onPressHandleClose = () => {
    document.getElementById("image-uploader").value = null;
    setValues({
      id: "",
      ova: "",
      title: "",
      year: "",
      autor: "",
      presentation: "",
      url: "",
      imageSrc: defaultImageSrc,
      imageFile: null,
      documentFile: null,
      documentSrc: "",
    });
    setErrors({});
    handleClose();
  };

  const findAllOvas = () => {
    fetchAll()
      .then((items) => {
        setOvas(items);
      })
      .catch((err) => console.log("No se pudo cargar el listado"));
  };

  const deleteDocument = () => {
    setFieldValue("documentFile", null);
    setFieldValue("documentSrc", "");
  };

  return (
    <>
      <Dialog
        onClose={onPressHandleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {!!initialValues.id ? "Modificar" : "Agregar"}
        </DialogTitle>
        <DialogContent dividers>
          <div className="textFieldItemImage">
            <img
              id="image-uploader"
              src={values.imageSrc}
              alt="avatar"
              className="ovaImage"
            />
            <Button
              variant="contained"
              component="label"
              color="primary"
              startIcon={<CloudUploadOutlined />}
            >
              Elegir Imagen
              <input
                name="image"
                accept="image/*"
                id="contained-button-file"
                type="file"
                hidden
                onChange={(e) => {
                  try {
                    let imageFile = e.target.files[0];
                    validateTypeImage(imageFile.type);
                    const reader = new FileReader();
                    reader.onload = (x) => {
                      setValues({
                        ...values,
                        imageFile,
                        imageSrc: x.target.result,
                      });
                    };
                    reader.readAsDataURL(imageFile);
                  } catch (error) {
                    setSeverity("warning");
                    setOpenSnackbar(true);
                    setMessageSnackbar(error);
                  }
                }}
              />
            </Button>
          </div>
          <div className="textFieldItem">
            <FormControl fullWidth style={{ marginTop: 16 }}>
              <InputLabel id="demo-simple-select-label">OVA</InputLabel>
              <Select
                value={values.ova}
                onChange={(e) => {
                  console.log(e.target);
                  setFieldValue("ova", e.target.value);
                }}
                label="Ova"
                error={!!errors.ova}
                variant="outlined"
                fullWidth
              >
                <MenuItem value="">Seleccionar</MenuItem>
                {ovas.map((ova) => (
                  <MenuItem key={ova.id} value={ova.id}>
                    {ova.name}
                  </MenuItem>
                ))}
              </Select>
              {!!errors.ova && (
                <FormHelperText style={{ color: "red", margin: 0, padding: 0 }}>
                  {errors.ova}
                </FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="textFieldItem">
            <TextField
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.title}
              helperText={errors.title}
              id="title"
              label="Título"
              onChange={handleChange}
              value={values.title}
            />
          </div>
          <div className="textFieldItem">
            <TextField
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.autor}
              helperText={errors.autor}
              id="autor"
              label="Autor"
              onChange={handleChange}
              value={values.autor}
              style={{ marginRight: 5, flex: 2 }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={["year"]}
                label="Year only"
                value={values.year}
                onChange={(newValue) => {
                  setFieldValue("year", newValue._i);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.year}
                    helperText={errors.year}
                    style={{ marginTop: 8 }}
                  />
                )}
                style={{ marginLeft: 5, flex: 1 }}
              />
            </LocalizationProvider>
          </div>
          <div className="textFieldItem">
            <TextField
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.presentation}
              helperText={errors.presentation}
              id="presentation"
              label="Presentación"
              multiline
              rows={3}
              onChange={handleChange}
              value={values.presentation}
            />
          </div>
          <div className="textFieldItem">
            <TextField
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.url}
              helperText={errors.url}
              id="url"
              label="URL"
              onChange={handleChange}
              value={values.url}
            />
          </div>
          <div className="textFieldItemImage" style={{ marginTop: 16 }}>
            <div className="">
              {!!values.documentSrc && (
                <List dense={true}>
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => deleteDocument()}
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <LibraryBooks />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={values.documentSrc} />
                  </ListItem>
                </List>
              )}
            </div>
            <Button
              variant="contained"
              component="label"
              color="primary"
              startIcon={<CloudUploadOutlined />}
            >
              Elegir Documento
              <input
                name="image"
                accept="application/*"
                type="file"
                hidden
                onChange={(e) => {
                  try {
                    let documentFile = e.target.files[0];
                    validateTypeImage(documentFile.type);
                    console.log(documentFile);
                    const reader = new FileReader();
                    reader.onload = (x) => {
                      setValues({
                        ...values,
                        documentFile,
                        documentSrc: documentFile.name,
                      });
                    };
                    reader.readAsDataURL(documentFile);
                  } catch (error) {
                    setSeverity("warning");
                    setOpenSnackbar(true);
                    setMessageSnackbar(error);
                  }
                }}
              />
            </Button>
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
