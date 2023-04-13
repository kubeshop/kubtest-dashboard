import {CheckCircleFilled, LoadingOutlined, WarningFilled} from '@ant-design/icons';

import Colors from '@styles/Colors';

export type tooltipStatus = 'loading' | 'error' | 'success' | 'none';

export const tooltipIcons: {[key in tooltipStatus]: JSX.Element | undefined} = {
  loading: <LoadingOutlined />,
  success: <CheckCircleFilled style={{color: Colors.lime400, cursor: 'auto', paddingBottom: '2px'}} />,
  error: <WarningFilled style={{color: Colors.amber400}} />,
  none: undefined,
};

export const getTooltip = (status: tooltipStatus, message?: string) => {
  if (!tooltipIcons[status]) {
    return undefined;
  }

  if (status === 'error') {
    return {title: message, icon: tooltipIcons[status]};
  }

  return {icon: tooltipIcons[status]};
};