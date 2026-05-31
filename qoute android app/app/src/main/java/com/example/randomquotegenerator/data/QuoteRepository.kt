package com.example.randomquotegenerator.data

import kotlin.random.Random

/**
 * Repository interface for managing and retrieving quotes.
 */
interface QuoteRepository {
    /**
     * Returns the full list of available quotes.
     */
    fun getQuotes(): List<Quote>

    /**
     * Retrieves a random quote from the repository, ensuring it does not match the [exclude] quote.
     */
    fun getRandomQuote(exclude: Quote?): Quote
}

/**
 * Local implementation of [QuoteRepository] storing a static list of 22 inspirational quotes.
 */
class LocalQuoteRepository : QuoteRepository {
    private val quotes = listOf(
        Quote("The only way to do great work is to love what you do.", "Steve Jobs"),
        Quote("Life is what happens when you're busy making other plans.", "John Lennon"),
        Quote("The future belongs to those who believe in the beauty of their dreams.", "Eleanor Roosevelt"),
        Quote("It does not matter how slowly you go as long as you do not stop.", "Confucius"),
        Quote("In the end, it's not the years in your life that count. It's the life in your years.", "Abraham Lincoln"),
        Quote("Success is not final, failure is not fatal: it is the courage to continue that counts.", "Winston Churchill"),
        Quote("The only limit to our realization of tomorrow will be our doubts of today.", "Franklin D. Roosevelt"),
        Quote("Believe you can and you're halfway there.", "Theodore Roosevelt"),
        Quote("You miss 100% of the shots you don't take.", "Wayne Gretzky"),
        Quote("The best way to predict the future is to create it.", "Peter Drucker"),
        Quote("Do what you can, with what you have, where you are.", "Theodore Roosevelt"),
        Quote("Happiness is not something ready made. It comes from your own actions.", "Dalai Lama"),
        Quote("What you get by achieving your goals is not as important as what you become by achieving your goals.", "Zig Ziglar"),
        Quote("No masterpiece was ever created by a lazy artist.", "Anonymous"),
        Quote("Keep face to the sunshine and you cannot see a shadow.", "Helen Keller"),
        Quote("Act as if what you do makes a difference. It does.", "William James"),
        Quote("The mind is everything. What you think you become.", "Buddha"),
        Quote("Whether you think you can or think you can't, you are right.", "Henry Ford"),
        Quote("Strive not to be a success, but rather to be of value.", "Albert Einstein"),
        Quote("I have not failed. I've just found 10,000 ways that won't work.", "Thomas A. Edison"),
        Quote("Your time is limited, so don't waste it living someone else's life.", "Steve Jobs"),
        Quote("The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.", "Helen Keller")
    )

    override fun getQuotes(): List<Quote> = quotes

    override fun getRandomQuote(exclude: Quote?): Quote {
        if (quotes.isEmpty()) {
            throw IllegalStateException("Quote list is empty!")
        }
        if (quotes.size == 1) {
            return quotes.first()
        }
        var newQuote: Quote
        do {
            newQuote = quotes[Random.nextInt(quotes.size)]
        } while (newQuote == exclude)
        return newQuote
    }
}
