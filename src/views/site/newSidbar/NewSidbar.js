import { Button } from "@themesberg/react-bootstrap";
import * as React from "react";
import { Link } from "react-router-dom";
import "./NewSidbar.scss";

const NewSidbar = (props) => {
  return (
    <main className="login_main_div pt-30 pb-30">
      <div className="rounded p-30">
        <h1 className="text-center text-white">DATA ANALYSIS</h1>
        <p className="lead text-center">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus
          animi aspernatur ea eaque eligendi enim exercitationem facilis iure
          laborum magnam molestias nemo neque quam ratione reprehenderit
          sapiente totam, vero voluptate!
        </p>
        <div className="text-center">
          <Link to="/login">
            <Button>লগ-ইন / সাইন আপ</Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NewSidbar;
