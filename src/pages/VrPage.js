/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import tripDays from './data';

function Correct() {
  const [dragId, setDragId] = useState();
  const [boxes, setBoxes] = useState(tripDays);
  console.log(boxes);
  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
  };
  const handleDrop = (ev) => {
    const dragBox = boxes.find((box) => box.id === dragId);
    const dropBox = boxes.find((box) => box.id === ev.currentTarget.id);

    const dragBoxOrder = dragBox.order;
    const dropBoxOrder = dropBox.order;

    const newBoxState = boxes.map((box) => {
      if (box.id === dragId) {
        box.order = dropBoxOrder;
      }
      if (box.id === ev.currentTarget.id) {
        box.order = dragBoxOrder;
      }
      return box;
    });
    setBoxes(newBoxState);
  };

  return (
    <div className="App">
      {boxes
        .sort((a, b) => a.order - b.order)
        .map((box, index) => (
          <div
            draggable
            index={index}
            id={box.id}
            onDragOver={(e) => e.preventDefault()}
            onDragStart={handleDrag}
            onDrop={handleDrop}
            style={{
              backgroundColor: box.color,
              border: '1px solid',
              borderColor: box.color,
              borderRadius: '5px',
              color: '#FFF',
              width: '30%',
              height: '100px',
            }}
          >
            {box.id}
          </div>
        ))}
    </div>
  );
}

export default Correct;
