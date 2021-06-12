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
  const selectedShapeName = props.selectedShapeName;

  const checkNode = /*React.useCallback(*/() => {
    if (transformer !== null) {
      setStage(transformer.getStage());
      if (stage !== undefined) {
        var selectedNode = stage!.findOne("." + selectedShapeName);
        if (selectedNode !== undefined && selectedNode) {
          if (selectedNode === transformer.nodes([selectedNode])) {
            return;
          }
          setTransformer(transformer.nodes([selectedNode]));
        } else {
          transformer.detach();
        }
        transformer.getLayer()!.batchDraw();
      }
    }
  }
  //  , [selectedShapeName, stage, transformer]);

  useEffect(() => {
    checkNode();
  });

  return (
    <Transformer
      ref={node => { setTransformer(node!) }}
    />
  );
}
