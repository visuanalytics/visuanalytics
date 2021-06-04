import React from "react";
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

    const checkNode = React.useCallback( () => {
        transformer.detach();
        const stage = transformer.getStage();
    
        var selectedNode = stage!.findOne("." + selectedShapeName);
    
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
    ,[]);

    return (
        <Transformer 
            ref={(node : Konva.Transformer) => {transformer = node}}
        />
    );    
}
