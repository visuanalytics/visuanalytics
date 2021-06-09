import React, { useEffect } from "react";
import Konva from 'konva';
import {Transformer} from 'react-konva'

/** 
 * @interface TransformerProps describes the props of the Transformer Component
 */
 interface TransformerProps {
    selectedShapeName : string,
  }
  

export const TransformerComponent: React.FC<TransformerProps> = (props) => {
    let transformer = new Konva.Transformer();
    const selectedShapeName = props.selectedShapeName;

    console.log(transformer);
    console.log(props.selectedShapeName);

    const checkNode = React.useCallback( () => {

      console.log("reached");
      if (transformer !== null){  

        transformer.detach();
        const stage = transformer.getStage();
        if (stage !== undefined){
          console.log(stage);
          var selectedNode = stage!.findOne("." + selectedShapeName);

          console.log(selectedNode)

        if (selectedNode !== undefined && selectedNode){
          if (selectedNode ===  transformer.nodes([selectedNode])) {
            return;
          }
          transformer = transformer.nodes([selectedNode]);
        } else {
          transformer.detach();
        }
    
        transformer.getLayer()!.batchDraw();
        }
      }
    }
    ,[]);

    useEffect(() => {
      checkNode();
    }, [props.selectedShapeName]);

    return (
        <Transformer 
            ref={node=> {transformer = node!}}
        />
    );    
}
