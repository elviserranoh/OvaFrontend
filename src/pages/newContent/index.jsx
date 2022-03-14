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

import { findAll as fetchAll } from "../../api/topic";

import * as Yup from "yup";
import { URL_API } from "../../api/constants";
import { save, update } from "../../api/subjectMatter";

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

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
  NativeSelect,
} from "@mui/material";

const defaultImageSrc = "/img/image_placeholder.png";

export const NewContent = ({
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
  const [topics, setTopic] = useState([]);
  // const [contents, setContents] = useState([]);

  useEffect(() => {
    findAllTopics();
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
      topic: !!initialValues.topic ? initialValues.topic : "",
      type: !!initialValues.type ? initialValues.type : "",
      question: !!initialValues.question ? initialValues.question : "",
      rows: !!initialValues.rows ? initialValues.rows : [],
      columns: !!initialValues.columns ? initialValues.columns : [],
      answerKey: !!initialValues.answerKey ? initialValues.answerKey : [],
      imageSrc: !!initialValues.image
        ? `${URL_API}/api/ova/image/${initialValues.image}`
        : defaultImageSrc,
      imageFile: null,
      content: "",
      row: "",
      column: "",
      rowAnswerCorrect: "",
      columnAnswerCorrect: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      index: Yup.string().required("Requerido"),
      topic: Yup.string().required("Requerido"),
      type: Yup.string().nullable().required("Requerido"),
      question: Yup.string().required("Requerido"),
      rows: Yup.array().when(["type"], (type, schema) => {
        return type !== "1" && type !== "2" && type !== "3"
          ? schema.min(1, "Debe tener como minimo un contenido")
          : schema;
      }),
      columns: Yup.array().when(["type"], (type, schema) => {
        return type !== "1"
          ? schema.min(1, "Debe tener como minimo un contenido")
          : schema;
      }),
      answerKey: Yup.array().when(["type"], (type, schema) => {
        return type !== "1"
          ? schema.min(1, "Debe tener como minimo una respuesta correcta")
          : schema;
      }),
      row: Yup.string(),
      column: Yup.string(),
      rowAnswerCorrect: Yup.string(),
      columnAnswerCorrect: Yup.string(),
    }),
    onSubmit: (values) => {
      setSubmitting(false);

      const formData = new FormData();
      formData.append("index", values.index);
      formData.append("topicId", values.topic);
      formData.append("type", values.type);
      formData.append("question", values.question);
      formData.append("rows", values.rows);
      formData.append("columns", values.columns);
      formData.append("answerCorrects", JSON.stringify(values.answerKey));

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
              setSeverity("success");
              setMessageSnackbar(`Contenido modificado correctamente!`);
              setLoading(true);
              // const newData = data.map((item) => {
              //   if (item.id === values.id) {
              //     return response.data.content;
              //   }
              //   return item;
              // });
              // setData(newData);
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
              setSeverity("success");
              setMessageSnackbar(`Contenido agregado correctamente!`);
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
    handleClear();
    handleClose();
  };

  const findAllTopics = () => {
    fetchAll()
      .then((items) => {
        setTopic(items);
      })
      .catch((err) => console.log("No se pudo cargar el listado"));
  };

  const addContentRow = () => {
    setFieldValue("rows", [...values.rows, values.row]);
    setFieldValue("row", "", false);
  };

  const addContentColumn = () => {
    setFieldValue("columns", [...values.columns, values.column]);
    setFieldValue("column", "", false);
  };

  const deleteContentRow = (itemDelete) => {
    const exists = values.answerKey.filter((item) => item.row === itemDelete);

    if (Object.keys(exists).length > 0) {
      setOpenSnackbar(true);
      setSeverity("warning");
      setMessageSnackbar(
        "No puede eliminar la pregunta ya que esta siendo usada!."
      );
      return;
    }

    const newContent = values.rows.filter((item) => item !== itemDelete);
    setFieldValue("rows", [...newContent]);
  };

  const deleteContentColumn = (itemDelete) => {
    const exists = values.answerKey.filter(
      (item) => item.column === itemDelete
    );
    console.log(itemDelete);
    console.log(exists);

    if (Object.keys(exists).length > 0) {
      setOpenSnackbar(true);
      setSeverity("warning");
      setMessageSnackbar(
        "No puede eliminar la respuesta ya que esta siendo usada!."
      );
      return;
    }

    const newContent = values.columns.filter((item) => item !== itemDelete);
    setFieldValue("columns", [...newContent]);
  };

  const addAnswerCorrect = () => {
    if (values.type === "2" && values.answerKey.length === 1) {
      setOpenSnackbar(true);
      setSeverity("warning");
      setMessageSnackbar(
        "El tipo de contenido de Selección Simple solo puede tener una respuesta correcta!."
      );
      return;
    }

    let existsAnswerKey = [];

    if (values.type === "2" || values.type === "3") {
      existsAnswerKey = values.answerKey.filter(
        (item) => item.column === values.columnAnswerCorrect
      );
    } else if (values.type === "4") {
      const filter = {
        row: values.rowAnswerCorrect,
        column: values.columnAnswerCorrect,
      };
      existsAnswerKey = values.answerKey.filter(function (item) {
        for (var key in filter) {
          if (item[key] === undefined || item[key] != filter[key]) return false;
        }
        return true;
      });
    }

    if (Object.keys(existsAnswerKey).length === 1) {
      setOpenSnackbar(true);
      setSeverity("warning");
      setMessageSnackbar(
        "La respuesta ya esta marcada como respuesta correcta!."
      );
      return;
    }

    const newAnswerKey = {
      row: values.rowAnswerCorrect,
      column: values.columnAnswerCorrect,
    };
    setFieldValue("answerKey", [...values.answerKey, newAnswerKey]);
    setFieldValue("rowAnswerCorrect", "", false);
    setFieldValue("columnAnswerCorrect", "", false);
  };

  const deleteAnswerCorrect = (answer) => {
    let newData = [];

    console.clear();
    console.log(answer);

    if (values.type === "2" || values.type === "3") {
      newData = values.answerKey.filter(
        (item) => item.column !== answer.column
      );
    } else if (values.type === "4") {
      const filter = {
        row: answer.row,
        column: answer.column,
      };
      newData = values.answerKey.filter(function (item) {
        for (var key in filter) {
          if (item[key] === undefined || item[key] != filter[key]) return true;
        }
        return false;
      });
    }

    setFieldValue("answerKey", newData);
  };

  const handleClear = () => {
    document.getElementById("image-uploader").value = null;
    setValues({
      id: "",
      index: "",
      topic: "",
      type: "",
      question: "",
      rows: [],
      columns: [],
      answerKey: [],
      row: "",
      column: "",
      rowAnswerCorrect: "",
      columnAnswerCorrect: "",
      imageFile: null,
      imageSrc: defaultImageSrc,
    });
    setErrors({});
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

          <div className="textFieldItem" style={{ marginTop: 20 }}>
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Tipo
              </InputLabel>
              <NativeSelect
                style={{ paddingBottom: 11, fontSize: 14 }}
                inputProps={{
                  name: "type",
                  id: "uncontrolled-native",
                }}
                onChange={(e) => {
                  handleClear();
                  setFieldValue("type", e.target.value);
                }}
                value={values.type}
              >
                <option value=""></option>
                <option value="1">Parrafo</option>
                <option value="2">Selección Simple</option>
                <option value="3">Selección Multiple</option>
                <option value="4">Completación</option>
              </NativeSelect>
              {!!errors.type && (
                <FormHelperText style={{ color: "red", margin: 0, padding: 0 }}>
                  {errors.type}
                </FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="textFieldItem">
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Tema
              </InputLabel>
              <NativeSelect
                style={{ paddingBottom: 11, fontSize: 14 }}
                inputProps={{
                  name: "topic",
                  id: "uncontrolled-native",
                }}
                onChange={(e) => {
                  setFieldValue("topic", e.target.value);
                }}
                value={values.topic}
              >
                <option value=""></option>
                {topics.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </NativeSelect>
              {!!errors.topic && (
                <FormHelperText style={{ color: "red", margin: 0, padding: 0 }}>
                  {errors.topic}
                </FormHelperText>
              )}
            </FormControl>
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
          </div>

          {!!values.type && (
            <>
              <div className="textFieldItem">
                <TextField
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.question}
                  helperText={errors.question}
                  id="question"
                  label="Enunciado"
                  multiline
                  rows={3}
                  onChange={handleChange}
                  value={values.question}
                />
              </div>
              {values.type !== "1" && (
                <>
                  {values.type !== "2" && values.type !== "3" && (
                    <>
                      <div className="">
                        <div className="textFieldItem">
                          <TextField
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            id="row"
                            label="Preguntas"
                            onChange={handleChange}
                            value={values.row}
                          />
                          <IconButton edge="end" onClick={addContentRow}>
                            <AddCircleOutline />
                          </IconButton>
                        </div>

                        {!!errors.rows && (
                          <FormHelperText
                            style={{ color: "red", margin: 0, padding: 0 }}
                          >
                            {errors.rows}
                          </FormHelperText>
                        )}

                        <List dense={true}>
                          {values.rows.map((item) => (
                            <ListItem
                              key={item}
                              secondaryAction={
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => deleteContentRow(item)}
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
                    </>
                  )}
                  <div className="">
                    <div className="textFieldItem">
                      <TextField
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        id="column"
                        label="Respuestas"
                        onChange={handleChange}
                        value={values.column}
                      />
                      <IconButton edge="end" onClick={addContentColumn}>
                        <AddCircleOutline />
                      </IconButton>
                    </div>

                    {!!errors.columns && (
                      <FormHelperText
                        style={{ color: "red", margin: 0, padding: 0 }}
                      >
                        {errors.columns}
                      </FormHelperText>
                    )}

                    <List dense={true}>
                      {values.columns.map((item) => (
                        <ListItem
                          key={item}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => deleteContentColumn(item)}
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
                  <div className="">
                    <FormControl fullWidth>
                      <InputLabel
                        variant="standard"
                        style={{ fontWeight: 400, fontSize: 14 }}
                      >
                        Respuestas Correctas
                      </InputLabel>
                    </FormControl>
                    <div className="textFieldItem" style={{ marginTop: 25 }}>
                      {values.type !== "2" && values.type !== "3" && (
                        <FormControl fullWidth>
                          <InputLabel
                            variant="standard"
                            htmlFor="uncontrolled-native"
                          >
                            Pregunta
                          </InputLabel>
                          <NativeSelect
                            style={{ paddingBottom: 11, fontSize: 14 }}
                            inputProps={{
                              name: "rowAnswerCorrect",
                              id: "uncontrolled-native",
                            }}
                            onChange={(e) => {
                              setFieldValue("rowAnswerCorrect", e.target.value);
                            }}
                            value={values.rowAnswerCorrect}
                          >
                            <option value=""></option>
                            {values.rows.map((i) => (
                              <option key={i} value={i}>
                                {i}
                              </option>
                            ))}
                          </NativeSelect>
                        </FormControl>
                      )}

                      <FormControl fullWidth>
                        <InputLabel
                          variant="standard"
                          htmlFor="uncontrolled-native"
                        >
                          Respuesta
                        </InputLabel>
                        <NativeSelect
                          style={{ paddingBottom: 11, fontSize: 14 }}
                          inputProps={{
                            name: "columnAnswerCorrect",
                            id: "uncontrolled-native",
                          }}
                          onChange={(e) => {
                            setFieldValue(
                              "columnAnswerCorrect",
                              e.target.value
                            );
                          }}
                          value={values.columnAnswerCorrect}
                        >
                          <option value=""></option>
                          {values.columns.map((i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </NativeSelect>
                      </FormControl>
                      <IconButton edge="end" onClick={addAnswerCorrect}>
                        <AddCircleOutline />
                      </IconButton>
                    </div>

                    {!!errors.answerKey && (
                      <FormHelperText
                        style={{ color: "red", margin: 0, padding: 0 }}
                      >
                        {errors.answerKey}
                      </FormHelperText>
                    )}

                    <List dense={true} style={{ marginTop: 32 }}>
                      {values.answerKey.map((item) => (
                        <ListItem
                          key={item.row}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => deleteAnswerCorrect(item)}
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
                          <ListItemText
                            primary={`${
                              !!item.row
                                ? `${item.row} - ${item.column}`
                                : `${item.column}`
                            }`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </>
              )}
            </>
          )}
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
