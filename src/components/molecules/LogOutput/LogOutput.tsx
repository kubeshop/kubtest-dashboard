import {MouseEvent, memo, useCallback, useEffect, useRef, useState} from 'react';
import {useAsync, useUpdate} from 'react-use';
import useWebSocket from 'react-use-websocket';

import Ansi from 'ansi-to-react';

import {config} from '@constants/config';

import {useScrolledToBottom} from '@hooks/useScrolledToBottom';

import {LogAction} from '@models/log';

import {usePluginSlot, usePluginState} from '@plugins/pluginHooks';
import {AiBannerInterface} from '@plugins/types';

import {useAppDispatch, useAppSelector} from '@redux/hooks';
import {selectFullScreenLogOutput, setLogOutput, setLogOutputDOMRect} from '@redux/reducers/configSlice';

import {useWsEndpoint} from '@services/apiEndpoint';

import {getRtkIdToken} from '@utils/fetchUtils';

import {
  DrawerBannerContainer,
  LogOutputWrapper,
  StyledLogOutputContainer,
  StyledLogTextContainer,
  StyledPreLogText,
} from './LogOutput.styled';
import LogOutputHeader from './LogOutputHeader';
import {useCountLines, useLastLines} from './utils';

export type LogOutputProps = {
  logOutput?: string;
  executionId?: string;
  actions?: LogAction[];
  isRunning?: boolean;
  initialLines?: number;
  onChangeTab: (tab: string) => void;
};

const LogOutput: React.FC<LogOutputProps> = props => {
  const dispatch = useAppDispatch();
  const [, setAiBannerData] = usePluginState<AiBannerInterface>('aiExecutionBanner');
  const update = useUpdate();

  const {
    logOutput = 'No logs',
    executionId,
    actions = ['copy', 'fullscreen'],
    isRunning,
    initialLines = 300,
    onChangeTab,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const isScrolledToBottom = useScrolledToBottom(scrollableRef.current);

  const wsRoot = useWsEndpoint();

  const {isFullScreenLogOutput} = useAppSelector(selectFullScreenLogOutput);

  const [logs, setLogs] = useState('');
  const [shouldConnect, setShouldConnect] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const lines = useCountLines(logs);
  const visibleLogs = useLastLines(logs, expanded || isRunning ? Infinity : initialLines);
  const drawerBanner = usePluginSlot('executionDrawerBanner');

  const onExpand = useCallback((event: MouseEvent) => {
    event.preventDefault();
    setExpanded(true);
  }, []);

  // TODO: Consider getting token different way than using the one from RTK
  const {value: token, loading: tokenLoading} = useAsync(getRtkIdToken);
  useWebSocket(
    `${wsRoot}/executions/${executionId}/logs/stream`,
    {
      onMessage: e => {
        const logData = e.data;

        setLogs(prev => {
          if (prev) {
            try {
              const dataToJSON = JSON.parse(logData);
              const potentialOutput = dataToJSON?.result?.output || dataToJSON?.output;

              if (potentialOutput) {
                return potentialOutput;
              }

              return `${prev}\n${dataToJSON.content}`;
            } catch (err) {
              // It may be just an output directly, so we have to ignore it
            }
            return `${prev}\n${logData}`;
          }

          return `${logData}`;
        });
      },
      shouldReconnect: () => true,
      retryOnError: true,
      queryParams: token ? {token} : {},
    },
    shouldConnect && !tokenLoading
  );

  useEffect(() => {
    if (!isRunning) {
      setLogs(logOutput);
    } else {
      setLogs('');
    }

    return () => {
      setLogs('');
    };
  }, [isRunning, executionId]);

  useEffect(() => {
    setShouldConnect(isRunning || false);
  }, [isRunning]);

  useEffect(() => {
    if (isFullScreenLogOutput) {
      dispatch(setLogOutput(logs));
    } else {
      dispatch(setLogOutput(''));
    }
  }, [logs, isFullScreenLogOutput]);

  useEffect(() => {
    if (scrollableRef.current && isScrolledToBottom) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (scrollableRef.current) {
      setTimeout(() => {
        if (scrollableRef.current) {
          scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [executionId]);

  useEffect(() => {
    const rect = scrollableRef?.current?.getBoundingClientRect();
    if (rect) {
      dispatch(
        setLogOutputDOMRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        })
      );
    }
  }, [isFullScreenLogOutput]);

  useEffect(() => {
    setAiBannerData({
      onClose: () => {
        localStorage.setItem(config.isAiBannerHidden, 'true');
        update();
      },
      onAccept: () => {
        localStorage.setItem(config.isAiBannerHidden, 'true');
        onChangeTab('ai-insights');
      },
    });
  }, []);

  return (
    <LogOutputWrapper>
      {drawerBanner ? <DrawerBannerContainer>{drawerBanner}</DrawerBannerContainer> : null}
      <StyledLogOutputContainer ref={containerRef}>
        <LogOutputHeader logOutput={logs} actions={actions} />

        <StyledLogTextContainer ref={scrollableRef} bannerVisible={Boolean(drawerBanner)}>
          {visibleLogs ? (
            <StyledPreLogText data-test="log-output">
              {!expanded && lines >= initialLines ? (
                <>
                  <a href="#" onClick={onExpand}>
                    Click to show all {lines} lines...
                  </a>
                  <br />
                </>
              ) : null}
              <Ansi useClasses>{visibleLogs}</Ansi>
            </StyledPreLogText>
          ) : null}
        </StyledLogTextContainer>
      </StyledLogOutputContainer>
    </LogOutputWrapper>
  );
};

export default memo(LogOutput);
