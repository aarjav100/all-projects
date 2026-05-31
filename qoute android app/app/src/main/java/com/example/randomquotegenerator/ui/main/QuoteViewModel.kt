package com.example.randomquotegenerator.ui.main

import android.app.Application
import android.content.Context
import androidx.lifecycle.AndroidViewModel
import com.example.randomquotegenerator.data.Quote
import com.example.randomquotegenerator.data.QuoteRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

/**
 * ViewModel responsible for holding the quote generation UI state and managing business logic.
 * Inherits from [AndroidViewModel] to access SharedPreferences via application context.
 */
class QuoteViewModel(
    application: Application,
    private val quoteRepository: QuoteRepository
) : AndroidViewModel(application) {

    private val sharedPreferences = application.getSharedPreferences("quote_prefs", Context.MODE_PRIVATE)

    private val _uiState = MutableStateFlow(QuoteUiState())
    val uiState: StateFlow<QuoteUiState> = _uiState.asStateFlow()

    // Store favorite quotes as unique strings: "text|author"
    private val favorites = mutableSetOf<String>()

    init {
        // Load existing favorites and quote count
        val savedFavorites = sharedPreferences.getStringSet("favorites", emptySet()) ?: emptySet()
        favorites.addAll(savedFavorites)

        val totalViewed = sharedPreferences.getInt("total_viewed", 0)

        // Select the first random quote
        val initialQuote = quoteRepository.getRandomQuote(null)
        val initialIsFavorite = isQuoteFavorite(initialQuote)
        
        val newTotalViewed = totalViewed + 1
        sharedPreferences.edit().putInt("total_viewed", newTotalViewed).apply()

        _uiState.value = QuoteUiState(
            currentQuote = initialQuote,
            isFavorite = initialIsFavorite,
            totalQuotesViewed = newTotalViewed
        )
    }

    /**
     * Triggers the selection of a new random quote, ensuring it is different from the current one.
     * Also updates the total quotes viewed counter.
     */
    fun showNextQuote() {
        val current = _uiState.value.currentQuote
        val nextQuote = quoteRepository.getRandomQuote(current)
        val isFav = isQuoteFavorite(nextQuote)
        val newTotal = _uiState.value.totalQuotesViewed + 1
        
        sharedPreferences.edit().putInt("total_viewed", newTotal).apply()

        _uiState.update {
            it.copy(
                currentQuote = nextQuote,
                isFavorite = isFav,
                totalQuotesViewed = newTotal
            )
        }
    }

    /**
     * Toggles the favorite status of the currently displayed quote and persists it to SharedPreferences.
     */
    fun toggleFavorite() {
        val current = _uiState.value.currentQuote ?: return
        val key = getQuoteKey(current)
        val isFavNow = if (favorites.contains(key)) {
            favorites.remove(key)
            false
        } else {
            favorites.add(key)
            true
        }
        
        sharedPreferences.edit().putStringSet("favorites", favorites.toSet()).apply()
        
        _uiState.update {
            it.copy(isFavorite = isFavNow)
        }
    }

    private fun isQuoteFavorite(quote: Quote): Boolean {
        return favorites.contains(getQuoteKey(quote))
    }

    private fun getQuoteKey(quote: Quote): String {
        return "${quote.text}|${quote.author}"
    }
}

/**
 * UI State representation for the quote generator screen.
 */
data class QuoteUiState(
    val currentQuote: Quote? = null,
    val isFavorite: Boolean = false,
    val totalQuotesViewed: Int = 0
)
