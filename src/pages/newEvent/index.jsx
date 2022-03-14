import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { useFormik } from "formik";

import DatePicker from "@mui/lab/DatePicker";
import TimePicker from "@mui/lab/TimePicker";

import * as Yup from "yup";
import { save, update } from "../../api/event";

import moment from "moment";

import AdapterDateFns from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import "./style.css";
import { useEffect, useState } from "react";

export const NewEvent = ({
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
      date: !!initialValues.date ? initialValues.date : "",
      time: !!initialValues.time ? initialValues.time : "",
      description: !!initialValues.description ? initialValues.description : "",
      location: !!initialValues.location ? initialValues.location : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      date: Yup.string().required("Requerido"),
      time: Yup.string().required("Requerido"),
      description: Yup.string().nullable().required("Requerido"),
      location: Yup.string().required("Requerido"),
    }),
    onSubmit: (values) => {
      setSubmitting(false);

      const formData = new FormData();
      formData.append("date", values.date);
      formData.append("time", moment(values.time).format("HH:mm"));
      formData.append("description", values.description);
      formData.append("location", values.location);

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
              setMessageSnackbar(`Evento modificado correctamente!`);
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
              setMessageSnackbar(`Evento agregado correctamente!`);
              setLoading(true);
            }
          })
          .catch((err) => {
            console.log("ERROR", err);
          });
      }
    },
  });

  const onPressHandleClose = () => {
    setValues({
      id: "",
      date: "",
      time: "",
      description: "",
      location: "",
    });
    setErrors({});
    handleClose();
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
          <div
            className="textFieldItem"
            style={{ justifyContent: "space-between" }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={["year", "month", "day"]}
                label="Fecha"
                value={values.date}
                onChange={(newValue) => {
                  const currentDate = moment(newValue).format("YYYY-MM-DD");
                  setFieldValue("date", currentDate);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.date}
                    helperText={errors.date}
                    style={{ marginTop: 8, flex: 1, marginRight: 10 }}
                  />
                )}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                ampm={false}
                openTo="hours"
                views={["hours", "minutes"]}
                inputFormat="HH:mm"
                mask="__:__"
                label="Hora"
                value={values.time}
                onChange={(newValue) => {
                  setFieldValue("time", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.time}
                    helperText={errors.time}
                    style={{ marginTop: 8, flex: 1, marginLeft: 10 }}
                  />
                )}
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
              error={!!errors.location}
              helperText={errors.location}
              id="location"
              label="Ubicación"
              onChange={handleChange}
              value={values.location}
            />
          </div>
          <div className="textFieldItem">
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
              rows={3}
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
