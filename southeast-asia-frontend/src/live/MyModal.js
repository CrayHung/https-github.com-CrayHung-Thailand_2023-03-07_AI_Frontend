import React, { useState } from "react";
import { Modal } from "antd";
// import "antd/dist/antd.css";

const MyModal = (prop) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  const showModal = () => {
    setIsModalOpen(true);

    const imageSrc = document.getElementById(prop.imageId).src.replace('thumbnail/', '');
    setImageSrc(imageSrc);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <img
        alt=""
        // src={"http://192.168.195.213:8080" + cam4.imagePath}
        // src={`http://${ip}:8080${cam4.imagePath}`}
        src={""}
        width={"100%"}
        id={prop.imageId}
        onClick={() => {
          showModal();
        }}
      ></img>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={() => {
          handleOk();
        }}
        onCancel={() => {
          handleCancel();
        }}
        width={"70%"}
      >
        <img
          alt=""
          // src={"http://192.168.195.213:8080" + cam4.imagePath}
          // src={`http://${ip}:8080${cam4.imagePath}`}
          src={imageSrc}
          width={"100%"}
        ></img>
      </Modal>
    </>
  );
};

export default MyModal;
