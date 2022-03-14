import { URL_API } from "./constants";
import Swal from "sweetalert2";
import axios from "axios";

export const findAll = (page, pagesize, filterSearch, valueSearch) => {
  const access_token = localStorage.getItem("access_token");

  let url = `${URL_API}/api/student/page/${page}/pagesize/${pagesize}`;

  if (!!filterSearch && !!valueSearch) {
    url += `?filterSearch=${filterSearch}&valueSearch=${valueSearch}`;
  }

  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
};

export const findStudentById = async (id) => {
  const access_token = localStorage.getItem("access_token");

  const resp = await fetch(`${URL_API}/api/student/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const result = await resp.json();
  return result;
};

export const saveStudent = async (values) => {
  try {
    const access_token = localStorage.getItem("access_token");

    const result = await fetch(`${URL_API}/api/student`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    return result.json();
  } catch (error) {
    console.log("saveStudent", error);
  }
};

export const updateStudent = async (values) => {
  try {
    const access_token = localStorage.getItem("access_token");

    const resp = await fetch(`${URL_API}/api/student/${values.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (resp.ok) {
      const data = await resp.json();
      return data;
    } else
      Swal.fire({
        title: "No se pudo guardar los datos del usuario, intente nuevamente",
        icon: "warning",
        showConfirmButton: false,
        timer: 1500,
      });
  } catch (error) {
    console.log("updateStudent", error);
  }
};

export const registerStudent = async (payload) => {
  try {
    const access_token = localStorage.getItem("access_token");

    const resp = await fetch(`${URL_API}/api/student`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await resp.json();

    if (resp.status === 400) {
    }

    if (resp.status === 201) {
      const data = JSON.parse(result);
    }
  } catch (error) {
    console.log("registerStudent", error);
  }
};

export const deleteStudentById = async (id) => {
  try {
    const access_token = localStorage.getItem("access_token");
    const response = await fetch(`${URL_API}/api/student/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("deleteStudentById", error);
  }
};

export const updateImageProfile = async (id, formData) => {
  const access_token = localStorage.getItem("access_token");

  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "content-type": "multipart/form-data",
    },
  };

  const resp = await axios.put(
    `${URL_API}/api/student/${id}/image`,
    formData,
    config
  );
  return resp;
};

export const recoveryPassword = async (identityDocument) => {
  try {
    const resp = await axios.get(
      `${URL_API}/api/email/forgot-password/${identityDocument}`
    );
    return resp;
  } catch (error) {
    console.log("deleteStudentById", error);
  }
};
