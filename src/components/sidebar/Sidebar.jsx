import React from "react";
import {
  LineStyle,
  Event,
  Feedback,
  Person,
  WifiTethering,
  DescriptionOutlined,
  QuestionAnswerOutlined,
  AssignmentOutlined,
  BookmarksOutlined,
  BallotOutlined,
} from "@material-ui/icons";

import "./sidebar.css";
import { NavLink } from "react-router-dom";

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <NavLink to="/" exact activeClassName="active">
                <LineStyle className="sidebarIcon" />
                Resumen
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <NavLink to="/users" exact activeClassName="active">
                <Person className="sidebarIcon" />
                Estudiantes
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <NavLink to="/ovas" exact activeClassName="active">
                <WifiTethering className="sidebarIcon" />
                Ovas
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <NavLink to="/topic" exact activeClassName="active">
                <BallotOutlined className="sidebarIcon" />
                Temas
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <NavLink to="/contents" exact activeClassName="active">
                <BookmarksOutlined className="sidebarIcon" />
                Contenidos
              </NavLink>
            </li>
            {/* <li className="sidebarListItem">
              <NavLink to="/tests" exact activeClassName="active">
                <AssignmentOutlined className="sidebarIcon" />
                Pruebas
              </NavLink>
            </li> */}
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Staff</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <NavLink to="/events" exact activeClassName="active">
                <Event className="sidebarIcon" />
                Eventos
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <NavLink to="/feed" exact activeClassName="active">
                <Feedback className="sidebarIcon" />
                Anuncios
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <NavLink to="/documents" exact activeClassName="active">
                <DescriptionOutlined className="sidebarIcon" />
                Documentos
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
