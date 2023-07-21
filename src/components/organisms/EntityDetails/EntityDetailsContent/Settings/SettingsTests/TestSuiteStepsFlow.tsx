import {useEffect, useMemo, useState} from 'react';
import ReactFlow, {Controls, Edge, Node} from 'reactflow';

import {nanoid} from '@reduxjs/toolkit';

import {LocalStep} from '@src/models/testSuite';

import AddNode from './Nodes/AddNode';
import IntersectionNode from './Nodes/IntersectionNode';
import StepNode from './Nodes/StepNode';
import {ReactFlowContainer, addHeight, itemHeight, itemWidth} from './SettingsTests.styled';

interface ExtendedNode extends Node {
  group?: number | string;
}

type TestSuiteStepsFlowProps = {
  steps: LocalStep[][];
  setSteps: (steps: LocalStep[][]) => void;
  showTestModal: (group: number) => void;
  showDelayModal: (group: number) => void;
  isV2: boolean;
};

// Configure
const horizontalGap = 150;
const verticalGapBeforeAdd = 20;
const verticalGapBetweenItems = 32;

const getItemPosition = (group: number, itemIndex: number) => ({
  x: itemWidth / 2 + group * (itemWidth + horizontalGap),
  y: itemHeight / 2 + itemIndex * (verticalGapBetweenItems + itemHeight),
});
const getIntersectionPosition = (group: number) => {
  const {x, y} = getItemPosition(group, 0);
  return {x: x - itemWidth / 2 - horizontalGap / 2, y};
};
const getAddPosition = (group: number, groupLength: number) => {
  const {x, y} = getItemPosition(group, groupLength - 1);
  return {x, y: y + itemHeight / 2 + verticalGapBeforeAdd + addHeight / 2};
};

const TestSuiteStepsFlow: React.FC<TestSuiteStepsFlowProps> = props => {
  const {steps, setSteps, showDelayModal, showTestModal, isV2} = props;

  const [nodes, setNodes] = useState<ExtendedNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const deleteNode = (id: string, group: number) => {
    if (steps[group].length === 1) {
      if (steps[group][0].id === id) {
        setSteps([...steps.slice(0, group), ...steps.slice(group + 1)]);
      }
    } else {
      setSteps([...steps.slice(0, group), steps[group].filter(item => item.id !== id), ...steps.slice(group + 1)]);
    }
  };

  useEffect(() => {
    const newNodes: ExtendedNode[] = [];

    steps.forEach((step, group) => {
      newNodes.push(
        ...step.map((item, itemIndex) => ({
          type: 'step',
          id: item.id!,
          data: {deleteNode, item, last: group === steps.length - 1, group},
          position: getItemPosition(group, itemIndex),
        }))
      );

      if (!isV2) {
        newNodes.push({
          type: 'add',
          id: nanoid(),
          position: getAddPosition(group, step.length),
          data: {showDelayModal, showTestModal, group},
        });
      }
    });

    for (let group = 0; group <= steps.length; group += 1) {
      newNodes.push({
        type: 'intersection',
        id: nanoid(),
        position: getIntersectionPosition(group),
        data: {
          showDelayModal,
          showTestModal,
          last: group === steps.length,
          group,
        },
      });
    }

    setNodes(newNodes);
  }, [steps]);

  // add edges
  useEffect(() => {
    const newEdges: Edge[] = nodes.reduce((result, node) => {
      if (node.type === 'intersection') {
        const nextNodes = nodes.filter(x => x.type === 'step' && x.data.group === node.data.group);
        return [
          ...result,
          ...nextNodes.map(nextNode => ({
            id: `${node.id}-${nextNode.id}`,
            source: node.id,
            target: nextNode.id,
            focusable: false,
          })),
        ];
      }
      if (node.type === 'step') {
        const nextIntersection = nodes.find(x => x.type === 'intersection' && x.data.group === node.data.group + 1)!;
        return [
          ...result,
          {id: `${node.id}-${nextIntersection.id}`, source: node.id, target: nextIntersection.id, focusable: false},
        ];
      }
      return result;
    }, [] as Edge[]);

    setEdges(newEdges);
  }, [nodes]);

  const nodeTypes = useMemo(() => ({step: StepNode, intersection: IntersectionNode, add: AddNode}), []);

  return (
    <ReactFlowContainer>
      <ReactFlow nodeTypes={nodeTypes} nodes={nodes} edges={edges} nodeOrigin={[0.5, 0.5]}>
        <Controls position="bottom-right" showInteractive={false} />
      </ReactFlow>
    </ReactFlowContainer>
  );
};

export default TestSuiteStepsFlow;
