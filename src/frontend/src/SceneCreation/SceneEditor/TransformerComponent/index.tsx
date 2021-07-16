import React, { useEffect } from "react";
import Konva from 'konva';
import { Transformer } from 'react-konva'

/** 
 * @interface TransformerProps describes the props of the Transformer Component
 */
interface TransformerProps {
  selectedShapeName: string,
}

export const TransformerComponent: React.FC<TransformerProps> = (props) => {
  const [transformer, setTransformer] = React.useState(new Konva.Transformer())
  const [stage, setStage] = React.useState(transformer.getStage())
  const [currentNode, setCurrentNode] = React.useState<Konva.Node>()
  const selectedShapeName = props.selectedShapeName;

  const checkNode = () => {
    if (transformer !== null) {
      setStage(transformer.getStage());
      if (stage !== undefined && stage !== null) {
        setCurrentNode(stage.findOne("." + selectedShapeName));
        if (currentNode !== undefined && currentNode) {
          if (currentNode === transformer.nodes([currentNode])) {
            return;
          }
          setTransformer(transformer.nodes([currentNode]));
          if (currentNode.getClassName() === "Text"){
            transformer.resizeEnabled(false);
          } else {
            transformer.resizeEnabled(true);
          }
        } else {
          transformer.detach();
        }
        if (transformer.getLayer() !== null){
          transformer.getLayer()!.batchDraw();
        }
      }
      if (selectedShapeName === ""){
        transformer.detach();
      }
    }
  }

  useEffect(() => {
    checkNode();
  });

  return (
    <Transformer
      ref={node => {
		      if (node !== null && node !== undefined){
            setTransformer(node!);
          }
      }}
    />
  );
}
