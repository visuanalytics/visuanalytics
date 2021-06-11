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
    const [transformer, setTransformer] = React.useState(new Konva.Transformer())
    const [stage, setStage] = React.useState(transformer.getStage())
    //let transformer = new Konva.Transformer();
    const selectedShapeName = props.selectedShapeName;

    console.log(transformer);
    console.log(props.selectedShapeName);

    const checkNode = React.useCallback( () => {
      //transformer = new Konva.Transformer();
      console.log("reached");
      if (transformer !== null){  
      console.log("reached transformer")
        setStage( transformer.getStage() );
        console.log(stage);
        if (stage !== undefined){
          console.log(stage);
          var selectedNode = stage!.findOne("." + selectedShapeName);

          console.log(selectedNode)

        if (selectedNode !== undefined && selectedNode){
          if (selectedNode ===  transformer.nodes([selectedNode])) {
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
    ,[]);

    useEffect(() => {
      checkNode();
    }, [props]);

    return (
        <Transformer 
            ref={node=> {setTransformer(node!)}}
        />
    );    
}
