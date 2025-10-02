import { colors } from './colors';

export type RarityLevel = 'common' | 'rare' | 'epic' | 'legendary';

export const rarityConfig = {
  common: {
    label: 'Common',
    color: {
      light: colors.light.neutral[500],
      dark: colors.dark.neutral[500],
    },
    borderColor: {
      light: colors.light.neutral[400],
      dark: colors.dark.neutral[400],
    },
    backgroundColor: {
      light: colors.light.neutral[100],
      dark: colors.dark.neutral[100],
    },
    gradient: {
      light: ['#9E9E9E', '#BDBDBD'],
      dark: ['#6B6B6B', '#8E8E8E'],
    },
    glow: {
      light: 'rgba(158, 158, 158, 0.3)',
      dark: 'rgba(107, 107, 107, 0.3)',
    },
    weight: 60,
  },
  rare: {
    label: 'Rare',
    color: {
      light: colors.light.primary[600],
      dark: colors.dark.primary[600],
    },
    borderColor: {
      light: colors.light.primary[500],
      dark: colors.dark.primary[500],
    },
    backgroundColor: {
      light: colors.light.primary[50],
      dark: colors.dark.primary[50],
    },
    gradient: {
      light: ['#1E88E5', '#42A5F5'],
      dark: ['#64B5F6', '#90CAF9'],
    },
    glow: {
      light: 'rgba(33, 150, 243, 0.4)',
      dark: 'rgba(100, 181, 246, 0.4)',
    },
    weight: 25,
  },
  epic: {
    label: 'Epic',
    color: {
      light: '#9C27B0',
      dark: '#BA68C8',
    },
    borderColor: {
      light: '#8E24AA',
      dark: '#AB47BC',
    },
    backgroundColor: {
      light: '#F3E5F5',
      dark: '#4A148C',
    },
    gradient: {
      light: ['#8E24AA', '#AB47BC'],
      dark: ['#AB47BC', '#CE93D8'],
    },
    glow: {
      light: 'rgba(156, 39, 176, 0.5)',
      dark: 'rgba(186, 104, 200, 0.5)',
    },
    weight: 10,
  },
  legendary: {
    label: 'Legendary',
    color: {
      light: '#FF6F00',
      dark: '#FFB74D',
    },
    borderColor: {
      light: '#F57C00',
      dark: '#FFA726',
    },
    backgroundColor: {
      light: '#FFF3E0',
      dark: '#E65100',
    },
    gradient: {
      light: ['#F57C00', '#FFA726', '#FFD54F'],
      dark: ['#FFA726', '#FFD54F', '#FFE082'],
    },
    glow: {
      light: 'rgba(255, 152, 0, 0.6)',
      dark: 'rgba(255, 183, 77, 0.6)',
    },
    weight: 5,
  },
} as const;

export const rarityBuffs = {
  common: {
    minBoost: 5,
    maxBoost: 10,
    durationMinutes: 30,
    cooldownMinutes: 60,
  },
  rare: {
    minBoost: 10,
    maxBoost: 15,
    durationMinutes: 45,
    cooldownMinutes: 90,
  },
  epic: {
    minBoost: 15,
    maxBoost: 20,
    durationMinutes: 60,
    cooldownMinutes: 120,
  },
  legendary: {
    minBoost: 20,
    maxBoost: 25,
    durationMinutes: 90,
    cooldownMinutes: 180,
  },
} as const;
