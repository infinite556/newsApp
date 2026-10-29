import '../css/NewsCard.css';
import { useState } from 'react';
import placeholder from '../images/placholder.jpg';
import FavoritesContext from '../context/FavoritesContext';
import { useContext } from 'react';

function NewsCard(props) {
  // ---------------------------------------------------------------------------
  // Favorites context
  // Gives this card access to the shared favorites list and the add/remove
  // functions defined in FavoritesProvider.
  // ---------------------------------------------------------------------------
  const { favorites, addToFavorites, removeFromFavorites } = useContext(FavoritesContext);

  // ---------------------------------------------------------------------------
  // Local UI state
  // Tracks whether THIS card's heart is filled (♥) or empty (♡).
  // It mirrors membership in the global favorites list for display only.
  // Initialized to true if this news item is already in the global list.
  // ---------------------------------------------------------------------------
  const [isFavorite, setIsFavorite] = useState(() =>
    favorites.some((item) => item.id === props.id)
  );

  // ---------------------------------------------------------------------------
  // handleToggleFavorite
  // Click handler for the favorite heart button.
  //
  // Bug fix (old code):
  //   - setIsFavorite(!isFavorite) was called FIRST, then the code checked
  //     `if (isFavorite ...)`. Because React state updates are asynchronous,
  //     `isFavorite` still held the OLD value inside this same function,
  //     so the add/remove decision was backwards.
  //   - The heart icon and the global favorites list could get out of sync.
  //
  // Fix:
  //   - Decide add vs remove by checking the CURRENT global list first.
  //   - Call the matching context function, then set local UI state to match.
  // ---------------------------------------------------------------------------
  function handleToggleFavorite(e) {
    // Stop the anchor (<a>) from navigating when the heart button is clicked.
    e.preventDefault();

    // favorites.includes(props) uses reference equality. This works when the same
    // news object is passed down from the parent. If a new object is created on
    // every render, compare a stable id instead (e.g. favorites.some(p => p.id === props.id)).
    if (favorites.some((item) => item.id === props.id)) {
      // Item is already favorited → remove it from the global list,
      // then update the local heart to empty.
      removeFromFavorites(props);
      setIsFavorite(false);
    } else {
      // Item is not favorited → add it to the global list,
      // then update the local heart to filled.
      addToFavorites(props);
      setIsFavorite(true);
    }
  }

  return (
    <li className="news-card" dir="rtl">
      <section className="news-item-img">
        <img
          src={props.image}
          alt={props.title}
          onError={(e) => {
            // If the image fails to load (404, broken link, etc.), swap in the
            // placeholder so the layout does not show a broken-image icon.
            e.target.src = placeholder;
            // Remove the handler so we only fall back once. Prevents an
            // infinite error loop if the placeholder itself fails to load.
            e.target.onError = null;
          }}
        />
      </section>

      <section className="news-item-dat">
        <h3 className="news-title zain-bold">{props.title}</h3>
      <p className="news-date">{props.published?.slice(0, 10)}</p>
      <p className="news-desc zain-light">{props.description || 'اقرأ آخر التفاصيل من مصدر الخبر.'}</p>

      <div className="news-actions">
        <a className="read-more" href={props.url} target="_blank" rel="noreferrer">
        Read article <span aria-hidden="true">↗</span>
        </a>
        <button
        type="button"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        onClick={handleToggleFavorite}
        className={`favorite-btn ${isFavorite ? 'fav' : ''}`}
        >
        {isFavorite ? '♥' : '♡'}
        </button>
      </div>
      </section>
    </li>
  );
}

export default NewsCard;
