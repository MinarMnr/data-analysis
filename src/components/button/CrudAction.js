import {
  faDownload,
  faEye,
  faPencilAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button } from "@themesberg/react-bootstrap";

const CrudAction = (props) => {
  const {
    onShowClick,
    onEditClick,
    onDeleteClick,
    onDownloadClick,
    onRejectClick,
    onSendBackClick,
    applicationStatus,
    displayHide = false,
    roles,
    currentApproverReviewerRoleName,
    disabledData,

  } = props;
  return (
    (
      <>
        {onShowClick !== undefined && (
          <Button
            style={{ cursor: "hover" }}
            variant="primary"
            className="f-left btn btn-sm mr-5 mb-5"
            type="button"
            onClick={onShowClick}
            title="View"
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
        )}
        {onEditClick !== undefined && (
          <Button
            style={{ cursor: "hover" }}
            variant="success"
            className={displayHide == true && (roles === "DSHE_DG" || roles === "DSHE_SA") ? "d-none" : "f-left btn btn-sm mr-5 mb-5"}
            type="button"

            disabled={
              applicationStatus === "APPROVED" ||
                applicationStatus === "UNDER_REVIEW"
                ? true
                : false
            }
            onClick={onEditClick}
            title="Edit"
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </Button >
        )}
        {
          onDeleteClick !== undefined && (
            <Button
              style={{ cursor: "hover" }}
              variant="danger"
              className="f-left btn btn-sm mb-5"
              type="button"
              disabled={applicationStatus === "APPROVED" ? true : false}
              onClick={onDeleteClick}
              title="Delete"
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
          )
        }
        {
          onDownloadClick !== undefined && (
            <Button
              style={{ cursor: "hover" }}
              variant="primary"
              className="f-left btn btn-sm mb-5"
              type="button"
              onClick={onDownloadClick}
              title="Download"
            >
              <FontAwesomeIcon icon={faDownload} />
            </Button>
          )
        }
        {
          onRejectClick !== undefined && (
            <Button
              disabled={disabledData}
              style={{ cursor: "hover" }}
              variant="danger"
              className="f-left btn btn-sm mb-5"
              type="button"
              onClick={onRejectClick}
              title="Reject"
            >
              REJECT
              {/* <FontAwesomeIcon icon={faClock} /> */}
            </Button>
          )
        }
      </>
    )
  );
};
export default CrudAction;
