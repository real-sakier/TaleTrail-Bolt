import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IUserDataSource, UserProfile } from '../ports/datasource.port';
import { dataSourceConfig } from '../config/datasource.config';

export class LiveUserAdapter implements IUserDataSource {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      dataSourceConfig.supabaseUrl,
      dataSourceConfig.supabaseKey,
    );
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile from Supabase:', error);
      return null;
    }

    return data;
  }

  async updateProfile(
    userId: string,
    updates: Partial<UserProfile>,
  ): Promise<UserProfile> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile in Supabase:', error);
      throw error;
    }

    return data;
  }

  async addXp(userId: string, xp: number): Promise<UserProfile> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new Error('User not found');
    }

    const newXp = profile.xp + xp;
    const newTotalXp = profile.totalXp + xp;
    const newLevel = Math.floor(newTotalXp / 100) + 1;

    return this.updateProfile(userId, {
      xp: newXp,
      totalXp: newTotalXp,
      level: newLevel,
    });
  }
}
