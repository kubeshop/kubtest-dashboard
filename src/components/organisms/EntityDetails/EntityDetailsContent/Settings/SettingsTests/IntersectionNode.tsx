import {Handle, Position} from 'reactflow';

import {Dropdown} from 'antd';

import {IntersectionContainer} from './SettingsTests.styled';

type IntersectionNodeProps = {
  data: {
    withoutHandles?: boolean;
    showModal: (value: string, group: number | string) => void;
    group: number | string;
  };
};
const IntersectionNode: React.FC<IntersectionNodeProps> = props => {
  const {data} = props;

  return (
    <>
      {data.withoutHandles ? null : <Handle type="target" position={Position.Left} />}
      <Dropdown
        overlayClassName="light-dropdown"
        trigger={['hover']}
        menu={{
          items: [
            {key: 1, label: <span onClick={() => data.showModal('test', data.group)}>Add a test</span>},
            {key: 2, label: <span onClick={() => data.showModal('delay', data.group)}>Add a delay</span>},
          ],
        }}
      >
        <IntersectionContainer>+</IntersectionContainer>
      </Dropdown>
      {data.withoutHandles ? null : <Handle type="source" position={Position.Right} />}
    </>
  );
};

export default IntersectionNode;