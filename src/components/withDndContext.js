/* eslint-disable react/display-name */
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

export default DragDropContext(HTML5Backend);
/*
import * as React from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

export default (Component) => {
  return (props) => (
    <DndProvider backend={HTML5Backend}>
      <Component {...props} />
    </DndProvider>
  );
};
*/
