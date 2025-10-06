import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DataSourceMode } from '../ports/datasource.port';
import type {
  IMinigameDataSource,
  IUserDataSource,
} from '../ports/datasource.port';
import { DataSourceFactory } from './DataSourceFactory';
import { getDataSourceMode } from '../config/datasource.config';

interface DataSourceContextValue {
  mode: DataSourceMode;
  minigameDataSource: IMinigameDataSource;
  userDataSource: IUserDataSource;
  switchMode: (newMode: DataSourceMode) => void;
}

const DataSourceContext = createContext<DataSourceContextValue | null>(null);

interface DataSourceProviderProps {
  children: ReactNode;
  initialMode?: DataSourceMode;
}

export const DataSourceProvider: React.FC<DataSourceProviderProps> = ({
  children,
  initialMode,
}) => {
  const [mode, setMode] = useState<DataSourceMode>(
    initialMode || getDataSourceMode(),
  );

  const switchMode = (newMode: DataSourceMode) => {
    console.log(`Switching datasource mode from ${mode} to ${newMode}`);
    DataSourceFactory.clearCache();
    setMode(newMode);
  };

  const value: DataSourceContextValue = {
    mode,
    minigameDataSource: DataSourceFactory.getMinigameDataSource(mode),
    userDataSource: DataSourceFactory.getUserDataSource(mode),
    switchMode,
  };

  return (
    <DataSourceContext.Provider value={value}>
      {children}
    </DataSourceContext.Provider>
  );
};

export const useDataSource = (): DataSourceContextValue => {
  const context = useContext(DataSourceContext);
  if (!context) {
    throw new Error('useDataSource must be used within DataSourceProvider');
  }
  return context;
};
