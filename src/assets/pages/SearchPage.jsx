import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SearchNews from '../components/SearchNews'
import Navigation from '../components/Navigation'
import NewsCard from '../components/NewsCard'
import '../css/SearchPage.css'

function SearchPage() {
  const [newsList, setNewsList] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    if (!searchQuery) return () => controller.abort()

    async function getNews() {
      try {
        setError('')
        const params = new URLSearchParams({
          q: searchQuery,
          language: 'ar',
          size: '10',
        })
        const response = await fetch(`/api/news?${params}`, {
          signal: controller.signal,
        })
        const responseText = await response.text()
        let data

        try {
          data = JSON.parse(responseText)
        } catch {
          throw new Error(
            `News service returned an invalid response (HTTP ${response.status}).`,
          )
        }

        if (!response.ok || data.status !== 'success') {
          throw new Error(data.message || 'Unable to search news.')
        }

        setNewsList(
          (data.results || []).map((article, index) => ({
            ...article,
            id: `${article.link}-${index}`,
            url: article.link,
            image: article.image_url,
            published: article.pubDate,
          })),
        )
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setNewsList([])
          setError(fetchError.message)
        }
      }
    }

    getNews()
    return () => controller.abort()
  }, [searchQuery])

  return (
    <>
      <Header />
      <Navigation />
      <main className="search-main">
        <SearchNews
          onHandleSearch={(query) => {
            const trimmedQuery = query.trim()
            setSearchQuery(trimmedQuery)
            if (!trimmedQuery) {
              setNewsList([])
              setError('')
            }
          }}
        />
        <ul className="news-list">
          {error && <h3>{error}</h3>}
          {!error && searchQuery && newsList.length === 0 && <h3>No news found</h3>}
          {newsList.map((newsItem) => (
            <NewsCard {...newsItem} key={newsItem.id} />
          ))}
        </ul>
      </main>
      <Footer />
    </>
  )
}

export default SearchPage
