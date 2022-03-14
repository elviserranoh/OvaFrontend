import React from "react";
import { Chart } from "../../components/chart/Chart";
import { FeaturedInfo } from "../../components/featureInfo/FeaturedInfo";
import { WidgetLg } from "../../components/widgetLg/WidgetLg";
import { WidgetSm } from "../../components/widgetSm/WidgetSm";
import { userData } from "../../dummyData";

import "./home.css";

export const Home = () => {
  return (
    <div className="home">
      <FeaturedInfo />
      <Chart title="Estudiantes Inscritos" data={userData} grid dataKey="enrolled" />
      <div className="homeWidgets">
          <WidgetSm />
          <WidgetLg />
      </div>
    </div>
  );
};
