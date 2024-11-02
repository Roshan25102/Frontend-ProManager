import React, { useEffect, useState } from "react";
import "./TaskContainer.css";
import { assets } from "../assets/assets";
import CollapsibleCard from "./CollapsibleCard";
import TaskModal from "./TaskModal";
import { progressStages } from "../assets/assets";
import { useNavigate } from "react-router-dom";

function TaskContainer({ tasks, stage, onProgressUpdate, showToast }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const openModal = (task = null) => {
    setSelectedTask(task);
    setModalOpen(true);
    console.log(task);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  const [collapseStates, setCollapseStates] = useState(
    progressStages.reduce((acc, stage) => {
      acc[stage] = false;
      return acc;
    }, {})
  );

  const toggleCollapse = (stage) => {
    setCollapseStates((prev) => ({
      ...prev,
      [stage]: !prev[stage],
    }));
  };

  return (
    <div className="task-container">
      <div className="task-top">
        <p className="task-top-left">{stage}</p>
        <div className="task-top-right">
          {stage === "To do" ? (
            <img id="plus" src={assets.plus} alt="" onClick={openModal} />
          ) : null}
          <img
            id="collabs"
            src={assets.collabs}
            alt=""
            onClick={() => toggleCollapse(stage)}
          />
        </div>
      </div>

      {tasks.map((task, index) => (
        <CollapsibleCard
          key={index}
          cardData={task}
          isCollapsed={collapseStates[stage]}
          onProgressUpdate={onProgressUpdate}
          showToast={showToast}
          onEdit={() => openModal(task)}
        ></CollapsibleCard>
      ))}

      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        showToast={showToast}
        // task={selectedTask}
        onProgressUpdate={onProgressUpdate}
      />
    </div>
  );
}

export default TaskContainer;
