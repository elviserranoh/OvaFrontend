import React from "react";
import "./topbar.css";

import NotificationsNoneIcon from "@material-ui/icons/NotificationsNoneRounded";
import { Menu, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { startLogoutAuth } from "../../duck/auth";
import { useHistory } from "react-router-dom";
import { URL_API } from "../../api/constants";

const defaultImageSrc = "/img/img_profile.jpg";

export const Topbar = () => {
  const state = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    dispatch(startLogoutAuth());
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goToProfile = () => {
    history.push("/profile");
    handleClose();
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <div className="logo">administrador</div>
        </div>
        <div className="topRight">
          {/* <div className="topbarIconContainer">
            <NotificationsNoneIcon />
            <span className="topbarIconBadge">2</span>
          </div> */}
          <div className="topbarUser">
            <img
              className="topbarUserAvatar"
              src={
                !!state.image
                  ? `${URL_API}/api/ova/image/${state.image}`
                  : defaultImageSrc
              }
              alt="usuario"
              onClick={handleMenu}
            />
            <div className="topbarUserName" onClick={handleMenu}>
              {`${state.firstName} ${state.lastName}`}
            </div>
          </div>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            style={{ zIndex: 999999999999999 }}
          >
            <MenuItem onClick={goToProfile}>Perfil</MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};
