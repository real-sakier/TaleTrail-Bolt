import { DataSourceMode } from '../ports/datasource.port';

export const getDataSourceMode = (): DataSourceMode => {
  const mode = process.env.EXPO_PUBLIC_DATASOURCE || 'seed';

  if (Object.values(DataSourceMode).includes(mode as DataSourceMode)) {
    return mode as DataSourceMode;
  }

  console.warn(`Invalid EXPO_PUBLIC_DATASOURCE: ${mode}, falling back to seed`);
  return DataSourceMode.SEED;
};

export const isFeatureEnabled = (feature: string): boolean => {
  const enabledFeatures = process.env.EXPO_PUBLIC_ENABLED_FEATURES?.split(',') || [];
  return enabledFeatures.includes(feature) || enabledFeatures.includes('*');
};

export const dataSourceConfig = {
  mode: getDataSourceMode(),
  supabaseUrl: process.env.VITE_SUPABASE_URL || '',
  supabaseKey: process.env.VITE_SUPABASE_ANON_KEY || '',
};
