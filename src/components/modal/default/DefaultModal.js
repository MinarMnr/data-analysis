import { Modal } from "@themesberg/react-bootstrap";
import "./DefaultModal.scss";

const DefaultModal = ({
  show = false,
  centered = true,
  loading = false,
  title = "Modal",
  size,
  onClose,
  children,
  salModal,
  nasModal,
  ...props
}) => {

  return (
    <>
      <Modal
        as={Modal.Dialog}
        show={show}
        onHide={onClose}
        size={size}
        centered={centered}
        className={salModal == true ? "modalSizing" : nasModal == true ? "resizingModal" : ""}
      >
        <Modal.Header className="custom-bg">
          <Modal.Title className="h6 mb-0 mt-9 f-left pl-10 text-white">
            {title}
          </Modal.Title>
          {/* <Button variant="close" aria-label="Close" onClick={(()=> {
            setClose(false)

          })} /> */}
        </Modal.Header>
        <Modal.Body >{children}</Modal.Body>
      </Modal>
    </>
  );
};

export default DefaultModal;
