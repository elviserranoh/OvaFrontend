import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { DocumentScanner } from "@mui/icons-material";
import { useFormik } from "formik";

import * as Yup from "yup";
import { save, update } from "../../api/feed";

import "./style.css";

export const NewFeed = ({
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
      description: !!initialValues.description ? initialValues.description : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      description: Yup.string().required("Requerido"),
    }),
    onSubmit: (values) => {
      setSubmitting(false);

      const formData = new FormData();
      formData.append("description", values.description);

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
              setMessageSnackbar(`Anuncio modificado correctamente!`);
              setLoading(true);
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
              setMessageSnackbar(`Anuncio agregado correctamente!`);
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
      description: "",
    });
    setErrors({});
    handleClose();
  };

  return (
    <>
      <Dialog
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
