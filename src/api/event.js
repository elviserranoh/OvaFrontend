import { URL_API } from "./constants";
import axios from "axios";

export const findAll = (page, pagesize, name) => {
  const access_token = localStorage.getItem("access_token");

  let url = `${URL_API}/api/event`;

  if ((page != null) & (pagesize != null)) {
    url += `/page/${page}/size/${pagesize}`;
  }

  if (!!name) {
    url += `?name=${name}`;
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

  const resp = await fetch(`${URL_API}/api/event/${id}`, {
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
    },
  };

  const resp = await axios.post(`${URL_API}/api/event`, formData, config);
  return resp;
};

export const update = async (id, formData) => {
  const access_token = localStorage.getItem("access_token");

  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  const resp = await axios.put(`${URL_API}/api/event/${id}`, formData, config);
  return resp;
};

export const deleteById = async (id) => {
  const access_token = localStorage.getItem("access_token");

  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  const resp = await axios.delete(`${URL_API}/api/event/${id}`, config);
  return resp;
};
