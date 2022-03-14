import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Topbar } from "../components/topbar/Topbar";
import { ContentList } from "../pages/contentList";
import { DocumentList } from "../pages/documentList";
import { EventList } from "../pages/eventList";
import { FeedList } from "../pages/feedList/FeedList";

import { Home } from "../pages/home/Home";
import { OvaList } from "../pages/ovaList/OvaList";
import { TopicList } from "../pages/topicList";
import { UserProfile } from "../pages/user/User";
import { UserList } from "../pages/userList/UserList";

import "./app.css";

export const DashboardRoute = () => {
  return (
    <>
      <Topbar />
      <div className="container">
        <Sidebar />
        <Switch>
          <Route exact path="/users" component={UserList} />
          <Route exact path="/ovas" component={OvaList} />
          <Route exact path="/topic" component={TopicList} />
          <Route exact path="/contents" component={ContentList} />
          <Route exact path="/profile" component={UserProfile} />
          <Route exact path="/events" component={EventList} />
          <Route exact path="/feed" component={FeedList} />
          <Route exact path="/documents" component={DocumentList} />
          <Route exact path="/" component={Home} />
          <Redirect to="/" />
        </Switch>
      </div>
    </>
  );
};
