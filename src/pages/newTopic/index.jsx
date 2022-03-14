import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import {
  CloudUploadOutlined,
  Delete,
  AddCircleOutline,
  LibraryBooks,
} from "@material-ui/icons";
import { useFormik } from "formik";

import { fetchAll } from "../../api/ovas";

import * as Yup from "yup";
import { URL_API } from "../../api/constants";
import { save, update } from "../../api/topic";

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

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

export const NewTopic = ({
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
      index: !!initialValues.index ? initialValues.index : "",
      title: !!initialValues.title ? initialValues.title : "",
      objetive: !!initialValues.objetive ? initialValues.objetive : "",
      ova: !!initialValues.ova ? initialValues.ova : "",
      contents: !!initialValues.contents ? initialValues.contents : [],
      imageSrc: !!initialValues.image
        ? `${URL_API}/api/ova/image/${initialValues.image}`
        : defaultImageSrc,
      imageFile: null,
      content: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      index: Yup.string().required("Requerido"),
      title: Yup.string().required("Requerido"),
      objetive: Yup.string().required("Requerido"),
      ova: Yup.string().required("Requerido"),
      content: Yup.string(),
      contents: Yup.array().min(1, "Debe tener como minimo un contenido"),
    }),
    onSubmit: (values) => {
      setSubmitting(false);

      const formData = new FormData();
      formData.append("index", values.index);
      formData.append("title", values.title);
      formData.append("objetive", values.objetive);
      formData.append("ovaId", values.ova);
      formData.append("contentTopic", values.contents);

      if (!!values.imageFile) {
        formData.append("imageFile", values.imageFile);
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
              setMessageSnackbar(
                `Ova ${values.name} modificado correctamente!`
              );
              // setLoading(true);
              const newData = data.map((item) => {
                if (item.id === values.id) {
                  return response.data.content;
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
        save(formData)
          .then((data) => {
            if (data.status === 400) {
              setErrors(data.errors);
            }
            if (data.status === 201) {
              handleClose();
              handleReset();
              setOpenSnackbar(true);
              setMessageSnackbar(`Ova ${values.name} agregado correctamente!`);
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

  const validateTypeImage = (type) => {
    switch (type) {
      case "image/png":
      case "image/jpeg":
        return;
      default:
        throw "Formato de imagen no valido, jpg y png unicamente";
    }
  };

  const onPressHandleClose = () => {
    document.getElementById("image-uploader").value = null;
    setValues({
      id: "",
      index: "",
      title: "",
      objetive: "",
      ova: "",
      contents: [],
      content: "",
      imageFile: null,
      imageSrc: defaultImageSrc,
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

  const addContents = () => {
    setFieldValue("contents", [...values.contents, values.content]);
    setFieldValue("content", "", false);
  };

  const deleteContent = (itemDelete) => {
    const newContent = values.contents.filter((item) => item !== itemDelete);
    setFieldValue("contents", [...newContent]);
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
            <TextField
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.index}
              helperText={errors.index}
              id="index"
              label="Indice"
              onChange={handleChange}
              value={values.index}
            />
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
              error={!!errors.objetive}
              helperText={errors.objetive}
              id="objetive"
              label="Objetivo"
              multiline
              rows={3}
              onChange={handleChange}
              value={values.objetive}
            />
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

          <div className="">
            <div className="textFieldItem">
              <TextField
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                id="content"
                label="Contenido"
                onChange={handleChange}
                value={values.content}
              />
              <IconButton edge="end" aria-label="delete" onClick={addContents}>
                <AddCircleOutline />
              </IconButton>
            </div>

            {!!errors.contents && (
              <FormHelperText style={{ color: "red", margin: 0, padding: 0 }}>
                {errors.contents}
              </FormHelperText>
            )}

            <List dense={true}>
              {values.contents.map((item) => (
                <ListItem
                  key={item}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteContent(item)}
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
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
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
