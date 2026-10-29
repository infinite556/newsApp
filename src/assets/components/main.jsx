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
      language: "en",
      size: "10",
    });

    async function getNews() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/news?${params}`,
          { signal: controller.signal },
        );
        const responseText = await response.text();
        let data;

        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            `News service returned an invalid response (HTTP ${response.status}).`,
          );
        }

        if (!response.ok || data.status !== "success") {
          throw new Error(data.message || "Unable to load news.");
        }

        setNewsList(
          (data.results || []).map((article, index) => ({
            ...article,
            id: `${article.link}-${index}`,
            url: article.link,
            image: article.image_url,
            published: article.pubDate,
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
