package com.vibe.app.di

import com.vibe.app.data.api.SupabaseClient
import com.vibe.app.data.repository.AuthRepository
import com.vibe.app.data.repository.PostRepository
import com.vibe.app.data.repository.ProfileRepository
import com.vibe.app.data.repository.StoryRepository
import com.vibe.app.data.repository.MessageRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import io.github.jan.supabase.SupabaseClient as SupabaseClientType
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideSupabaseClient(): SupabaseClientType = SupabaseClient.client

    @Provides
    @Singleton
    fun provideAuthRepository(): AuthRepository = AuthRepository()

    @Provides
    @Singleton
    fun providePostRepository(): PostRepository = PostRepository()

    @Provides
    @Singleton
    fun provideProfileRepository(): ProfileRepository = ProfileRepository()

    @Provides
    @Singleton
    fun provideStoryRepository(): StoryRepository = StoryRepository()

    @Provides
    @Singleton
    fun provideMessageRepository(): MessageRepository = MessageRepository()
}
