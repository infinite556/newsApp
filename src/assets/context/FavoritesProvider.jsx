import { useState } from 'react';
import FavoritesContext from './FavoritesContext';

function FavoritesProvider({ children }) {
  // ---------------------------------------------------------------------------
  // State
  // Holds the array of favorited news items.
  // ---------------------------------------------------------------------------
  const [favorites, setFavorites] = useState([]);

  // ---------------------------------------------------------------------------
  // addToFavorites
  // Adds a news item to the favorites array.
  //
  // Bug fix (old code):
  //   - favorites.push(favorite) mutates the existing state array directly.
  //     React does not detect direct mutation, so the component does not re-render.
  //   - push() returns the NEW LENGTH of the array (a number), not the array.
  //     setFavorites(favorites.push(favorite)) stored a number instead of an array.
  //
  // Fix:
  //   - Use the functional updater form setFavorites(prev => ...) so we always
  //     base the new array on the latest state, avoiding stale closure issues.
  //   - Spread prev into a NEW array and append favorite → immutable update.
  //     React sees a new array reference and re-renders the consumers.
  // ---------------------------------------------------------------------------
  function addToFavorites(favorite) {
    // Guard: do not add the same item twice (compare by id, not object reference).
    if (favorites.some((item) => item.id === favorite.id)) {
      console.log('favorite already exists');
      return;
    }

    // Immutable update: create a new array containing all previous items
    // plus the new favorite at the end. Log inside the updater so we print the
    // new state AFTER the update commits, not the stale pre-update value.
    setFavorites((prev) => {
      const next = [...prev, favorite];
      console.log(next);
      return next;
    });
  }

  // ---------------------------------------------------------------------------
  // removeFromFavorites
  // Removes a news item from the favorites array.
  //
  // Bug fix (old code):
  //   - favorites.splice(...) mutates the existing state array directly.
  //     React does not detect direct mutation, so the component does not re-render.
  //   - splice() returns an array of the REMOVED elements, not the remaining
  //     items. setFavorites(favorites.splice(...)) stored only the removed items.
  //
  // Fix:
  //   - Use filter() to build a NEW array that excludes the favorite.
  //   - Functional updater ensures we operate on the latest state.
  // ---------------------------------------------------------------------------
  function removeFromFavorites(favorite) {
    // Immutable update: keep every item except the one being removed (compare by id).
    setFavorites((prev) => {
      const next = prev.filter((item) => item.id !== favorite.id);
      console.log(next);
      return next;
    });
  }

  // ---------------------------------------------------------------------------
  // Context value
  // Expose the list and both functions to any component nested inside this
  // provider via useContext(FavoritesContext).
  // ---------------------------------------------------------------------------
  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesProvider;
