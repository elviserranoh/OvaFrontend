import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { Fingerprint, CloudUploadOutlined } from "@material-ui/icons";
import { DocumentScanner } from "@mui/icons-material";
import { useFormik } from "formik";

import * as Yup from "yup";
import { URL_API } from "../../api/constants";
import { save, update } from "../../api/ovas";

import "./newOva.css";

const defaultImageSrc = "/img/image_placeholder.png";

export const NewOva = ({
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
      name: !!initialValues.name ? initialValues.name : "",
      description: !!initialValues.description ? initialValues.description : "",
      imageSrc: !!initialValues.image
        ? `${URL_API}/api/ova/image/${initialValues.image}`
        : defaultImageSrc,
      imageFile: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Requerido"),
      description: Yup.string().required("Requerido"),
    }),
    onSubmit: (values) => {
      setSubmitting(false);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);

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
              console.clear();

              // setLoading(true);
              const newData = data.map((item) => {
                if (item.id === values.id) {
                  return response.data.content;
                }
                return item;
              });
              console.log(newData);
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
      name: "",
      description: "",
      imageFile: null,
      imageSrc: defaultImageSrc,
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
            <Fingerprint className="textFieldIconItem" />
            <TextField
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.name}
              helperText={errors.name}
              id="name"
              label="Nombre"
              onChange={handleChange}
              value={values.name}
            />
          </div>
          <div className="textFieldItem">
            <DocumentScanner className="textFieldIconItem" />
            <TextField
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.description}
              helperText={errors.description}
              id="description"
              label="Descripción"
              multiline
              rows={5}
              onChange={handleChange}
              value={values.description}
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
