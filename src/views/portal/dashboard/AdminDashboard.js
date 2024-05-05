import * as React from "react";
import { useState } from "react";
import DefaultCard from "../../../components/card/default/DefaultCard";
import {
    faFileArchive,
    faPauseCircle,
} from "@fortawesome/free-regular-svg-icons";
import DashboardWidget from "../_partials/DashboardWidget";

import "./Dashboard.scss";

const Dashboard = (props) => {
    const surveyCardProps = {
        title: "পরিদর্শন",
    };

    const DashBoardChart = [];

    return (
        <>
            <DefaultCard className="mb-50" {...surveyCardProps}>
                <div className="row align-items-center pr-15">
                    {DashBoardChart.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                            >
                                <DashboardWidget
                                    title={item.title}
                                    link={item.link}
                                    icon={item.icon}
                                    theme={item.theme}
                                />
                            </div>
                        );
                    })}
                </div>
            </DefaultCard>
        </>
    );
};

export default Dashboard;
