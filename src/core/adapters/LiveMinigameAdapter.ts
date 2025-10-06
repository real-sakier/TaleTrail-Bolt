import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  IMinigameDataSource,
  MinigameData,
  MinigameSessionRecord,
} from '../ports/datasource.port';
import { dataSourceConfig } from '../config/datasource.config';

export class LiveMinigameAdapter implements IMinigameDataSource {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      dataSourceConfig.supabaseUrl,
      dataSourceConfig.supabaseKey,
    );
  }

  async getQuestions(
    type: string,
    difficulty: string,
    limit: number,
  ): Promise<MinigameData[]> {
    const { data, error } = await this.supabase
      .from('minigame_questions')
      .select('*')
      .eq('type', type)
      .eq('difficulty', difficulty)
      .limit(limit);

    if (error) {
      console.error('Error fetching questions from Supabase:', error);
      return [];
    }

    return data || [];
  }

  async saveSession(session: MinigameSessionRecord): Promise<void> {
    const { error } = await this.supabase
      .from('minigame_sessions')
      .insert([session]);

    if (error) {
      console.error('Error saving session to Supabase:', error);
      throw error;
    }
  }

  async getSessionHistory(
    userId: string,
    limit: number = 10,
  ): Promise<MinigameSessionRecord[]> {
    const { data, error } = await this.supabase
      .from('minigame_sessions')
      .select('*')
      .eq('userId', userId)
      .order('completedAt', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching session history from Supabase:', error);
      return [];
    }

    return data || [];
  }
}
