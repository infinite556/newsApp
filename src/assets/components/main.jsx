import "../css/Main.css";
import NewsCard from "./NewsCard";
import { useEffect, useState } from "react";
import Navigation from "./Navigation";

function Main({ initialCategory = "" }) {
  const [newsList, setNewsList] = useState([]);
  const [category, setCategory] = useState(
    initialCategory === "latest_news" ? "" : initialCategory,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const handleCategory = (nextCategory) => {
    setCategory(nextCategory === "latest_news" ? "" : nextCategory);
  };

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      q: category || "tesla",
      from: "2026-09-29",
      sortBy: "publishedAt",
      pageSize: "20",
      apiKey: "c4edb6a422684444bc33dc4377b3ad09",
    });

    async function getNews() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?${params}`,
          { signal: controller.signal },
        );
        const data = await response.json();

        if (!response.ok || data.status !== "ok") {
          throw new Error(data.message || "Unable to load news.");
        }

        setNewsList(
          data.articles.map((article, index) => ({
            ...article,
            id: `${article.url}-${index}`,
            image: article.urlToImage,
            published: article.publishedAt,
          })),
        );
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setNewsList([]);
          setError(fetchError.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    getNews();
    return () => controller.abort();
  }, [category]);

  return (
    <main id="mn">
      <Navigation onCategoryChange={handleCategory} />
      <section className="content-shell">
        <div className="section-heading" dir="rtl">
          <p className="eyebrow">آخر الأخبار</p>
          <h2>ابقَ على اطلاع</h2>
          <p>أهم العناوين والأحداث في مكان واحد.</p>
        </div>

        <ul className="news-list">
          {isLoading && (
            <li className="status-card">
              <span className="spinner" /> Loading the latest stories...
            </li>
          )}
          {!isLoading && newsList.length === 0 && (
            <li className="status-card">
              {error || "No news found right now."}
            </li>
          )}
          {newsList.map((newsItem) => (
            <NewsCard {...newsItem} key={newsItem.id} />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;
