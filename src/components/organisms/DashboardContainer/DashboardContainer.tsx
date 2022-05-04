import {createContext, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {CSSTransition} from 'react-transition-group';

import {TablePaginationConfig} from 'antd';

import {DashboardBlueprint} from '@models/dashboard';

import {useAppSelector} from '@redux/hooks';
import {closeFullScreenLogOutput, selectApiEndpoint, selectFullScreenLogOutput} from '@redux/reducers/configSlice';

import {LogOutput} from '@molecules';

import {DashboardContent, DashboardInfoPanel} from '@organisms';

import useUpdateURLSearchParams from '@hooks/useUpdateURLSearchParams';

import {StyledDashboardContainerWrapper} from './DashboardContainer.styled';

type DashboardInnerProps = {
  dataSource: any;
  selectedRecord: any;
  queryFilters: any;
  allFilters: any;
};

type DashboardInfoPanelProps = {
  setInfoPanelVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  shouldInfoPanelBeShown: boolean;
  isInfoPanelExpanded: boolean;
  selectedRecord: any;
  setSecondLevelOpenState: React.Dispatch<React.SetStateAction<boolean>>;
  isSecondLevelOpen: boolean;
  selectedExecution: any;
  setSelectedExecution: React.Dispatch<React.SetStateAction<any>>;
  closeSecondLevel: () => void;
  closeDrawer: () => void;
};

export const DashboardContext = createContext<DashboardBlueprint & DashboardInfoPanelProps & DashboardInnerProps>({
  pageTitle: '',
  reduxListName: '',
  entityType: 'test-suites',
  hasInfoPanel: true,
  canSelectRow: true,
  columns: [],
  shouldInfoPanelBeShown: false,
  isInfoPanelExpanded: true,
  selectedRecord: null,
  isSecondLevelOpen: false,
  dataSource: null,
  queryFilters: null,
  allFilters: null,
  setSecondLevelOpenState: () => {},
  selectedExecution: null,
  setSelectedExecution: () => {},
  setInfoPanelVisibility: () => {},
  closeSecondLevel: () => {},
  closeDrawer: () => {},
});

const DashboardContainer: React.FC<DashboardBlueprint> = props => {
  const {
    hasInfoPanel,
    selectData,
    selectSelectedRecord,
    selectQueryFilters,
    selectAllFilters,
    setSelectedRecord,
    setQueryFilters,
    ...rest
  } = props;

  const dispatch = useDispatch();

  const dataSource: any = useAppSelector(selectData);
  const selectedRecord: any = useAppSelector(selectSelectedRecord);
  const queryFilters: any = useAppSelector(selectQueryFilters);
  const allFilters: any = useAppSelector(selectAllFilters);
  const apiEndpoint = useAppSelector(selectApiEndpoint);
  const {isFullScreenLogOutput, logOutput} = useAppSelector(selectFullScreenLogOutput);

  useUpdateURLSearchParams(queryFilters);

  const [isInfoPanelExpanded, setInfoPanelVisibility] = useState(true);
  const [isSecondLevelOpen, setSecondLevelOpenState] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState<any>(null);

  const onRowSelect = (rowRecord: any) => {
    if (!isInfoPanelExpanded) {
      setInfoPanelVisibility(true);
    }

    dispatch(setSelectedRecord({selectedRecord: rowRecord}));
  };

  // Should we check any other conditions e.g. data.length?
  const shouldInfoPanelBeShown = hasInfoPanel;

  const pagination: TablePaginationConfig = {
    onChange: (page: number) => {
      dispatch(setQueryFilters({...queryFilters, page: page - 1}));
    },

    onShowSizeChange: (page, pageSize) => {
      dispatch(setQueryFilters({...queryFilters, page: 0, pageSize}));
    },

    ...(allFilters.totals?.results ? {total: allFilters.totals?.results} : {}),

    ...(queryFilters.page ? {current: queryFilters.page + 1} : {}),

    ...(queryFilters.pageSize ? {pageSize: queryFilters.pageSize} : {}),

    hideOnSinglePage: true,
    showSizeChanger: false,
  };

  const closeSecondLevel = () => {
    setSecondLevelOpenState(false);
  };

  const closeDrawer = () => {
    closeSecondLevel();
    setInfoPanelVisibility(false);
  };

  const onCloseFullScreenOutput = () => {
    dispatch(closeFullScreenLogOutput());
  };

  const dashboardContextValues = {
    ...rest,
    dataSource,
    selectedRecord,
    queryFilters,
    allFilters,
    apiEndpoint,
    setSelectedRecord,
    setInfoPanelVisibility,
    isInfoPanelExpanded,
    setSecondLevelOpenState,
    isSecondLevelOpen,
    setQueryFilters,
    shouldInfoPanelBeShown,
    hasInfoPanel,
    selectedExecution,
    setSelectedExecution,
    closeSecondLevel,
    closeDrawer,
    onCloseFullScreenOutput,
  };

  useEffect(() => {
    onCloseFullScreenOutput();
  }, [rest.entityType]);

  return (
    <DashboardContext.Provider value={dashboardContextValues}>
      <StyledDashboardContainerWrapper>
        <DashboardContent onRowSelect={onRowSelect} paginationOptions={pagination} />
        <DashboardInfoPanel />
        {/* That is for Fullscreen Log Output */}
        <CSSTransition in={isFullScreenLogOutput} timeout={350} classNames="full-screen-log-output" unmountOnExit>
          <LogOutput logOutput={logOutput} isFullScreen />
        </CSSTransition>
      </StyledDashboardContainerWrapper>
    </DashboardContext.Provider>
  );
};

export default DashboardContainer;
