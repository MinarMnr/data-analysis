import React from "react";
import { Col, Row } from "@themesberg/react-bootstrap";

import CodeEditor from "./CodeEditor";

export const Documentation = (props) => {
  const {
    title,
    description,
    example = null,
    imports = null,
    scope = {},
    maxHeight = null,
  } = props;

  return (
    <>
      <div className="pt-2">
        <Row>
          <Col xs={12}>
            <h2 className="fs-5">{title}</h2>
            {description}
          </Col>
        </Row>
      </div>

      <div className="pb-5">
        <Row className="mt-4">
          <Col xs={12}>
            <CodeEditor
              code={example}
              scope={scope}
              imports={imports}
              maxHeight={maxHeight}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};
