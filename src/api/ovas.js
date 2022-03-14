import { URL_API } from "./constants";
import Swal from "sweetalert2";
import axios from "axios";

export const fetchAll = (page, pagesize) => {
  const access_token = localStorage.getItem("access_token");

  let url = `${URL_API}/api/ova`;

  if (page != null && pagesize != null) {
    url += `/page/${page}/size/${pagesize}`;
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

export const fetchAllByName = (page, pagesize, name) => {
  const access_token = localStorage.getItem("access_token");

  let url = `${URL_API}/api/ova/page/${page}/size/${pagesize}?name=${name}`;

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

export const findById = async (id) => {
  const access_token = localStorage.getItem("access_token");

  const resp = await fetch(`${URL_API}/api/ova/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const result = await resp.json();
  return result;
};

export const save = async (formData) => {
  const access_token = localStorage.getItem("access_token");

  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "content-type": "multipart/form-data",
    },
  };

  const resp = await axios.post(`${URL_API}/api/ova`, formData, config);
  return resp;
};

export const update = async (id, formData) => {
  const access_token = localStorage.getItem("access_token");

  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "content-type": "multipart/form-data",
    },
  };

  const resp = await axios.put(`${URL_API}/api/ova/${id}`, formData, config);
  return resp;
};

export const deleteById = async (id) => {
  try {
    const access_token = localStorage.getItem("access_token");
    const response = await fetch(`${URL_API}/api/ova/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("deleteById", error);
  }
};
