import { URL_API } from "./constants";
import axios from "axios";

export const findAll = (page, pagesize, title) => {
  const access_token = localStorage.getItem("access_token");

  let url = `${URL_API}/api/subject-matter/page/${page}/size/${pagesize}`;

  if (!!title) {
    url += `?title=${title}`;
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

export const findById = async (id) => {
  const access_token = localStorage.getItem("access_token");

  const resp = await fetch(`${URL_API}/api/subject-matter/${id}`, {
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

  const resp = await axios.post(`${URL_API}/api/subject-matter`, formData, config);
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

  const resp = await axios.put(`${URL_API}/api/subject-matter/${id}`, formData, config);
  return resp;
};

export const deleteById = async (id) => {
  const access_token = localStorage.getItem("access_token");

  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  const resp = await axios.delete(`${URL_API}/api/subject-matter/${id}`, config);
  return resp;
};
