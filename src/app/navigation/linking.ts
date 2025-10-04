import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['taletrail://', 'https://taletrail.app'],
  config: {
    screens: {
      Main: {
        screens: {
          Home: 'home',
          Quests: 'quests',
          Packs: 'packs',
          Profile: 'profile',
        },
      },
      CardDetail: {
        path: 'card/:cardId',
        parse: {
          cardId: (cardId: string) => cardId,
        },
      },
    },
  },
};
