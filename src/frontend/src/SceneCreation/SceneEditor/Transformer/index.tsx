import React, { useEffect } from "react";
import Konva from "konva";
import { Transformer } from "react-konva";

/**
 * @interface TransformerProps describes the props of the Transformer Component
 */
interface TransformerProps {
  selectedShapeName: string;
}

export const TransformerComponent: React.FC<TransformerProps> = (props) => {
  // transformer state used to add transformer to an element
  const [transformer, setTransformer] = React.useState(new Konva.Transformer());
  // stage state used to find the currentNode
  const [stage, setStage] = React.useState(transformer.getStage());
  // currentNode state containing the node the transformer is attached to
  const [currentNode, setCurrentNode] = React.useState<Konva.Node>();
  // selected shape name used to determine the type of element
  const selectedShapeName = props.selectedShapeName;

  /**
   * Method to check if a transformer should be attached or detached
   */
  const checkNode = () => {
    if (transformer !== null) {
      // set the stage of the transformer
      setStage(transformer.getStage());
      if (stage !== undefined && stage !== null) {
        // set the current node to the node with selectedShapeName as name
        setCurrentNode(stage.findOne("." + selectedShapeName));
        if (currentNode !== undefined && currentNode) {
          // if the currentNode is the same node the transformer is attached to, return
          if (currentNode === transformer.nodes([currentNode])) {
            return;
          }
          // attach transformer to node
          setTransformer(transformer.nodes([currentNode]));
          // disable resizing if the element is a text
          if (currentNode.getClassName() === "Text") {
            transformer.resizeEnabled(false);
          } else {
            transformer.resizeEnabled(true);
          }
        } else {
          // remove transformer
          transformer.detach();
        }
        // render transformer
        if (transformer.getLayer() !== null) {
          transformer.getLayer()!.batchDraw();
        }
      }
      // if no element is selected, remove the transformer
      if (selectedShapeName === "") {
        transformer.detach();
      }
    }
  };

  /**
   * useEffect to call checkNode() on every update
   */
  useEffect(() => {
    checkNode();
  });

  return (
    <Transformer
      ref={(node) => {
        if (node !== null && node !== undefined) {
          setTransformer(node!);
        }
      }}
    />
  );
};
