import '../css/SearchNews.css'
import { useState } from 'react'


function SearchNews({onHandleSearch}) {
    const [searchQuery, setSearchQuery] = useState('');
    
    const handleSearch=(e)=>{
        e.preventDefault();
        onHandleSearch(searchQuery);
    }

    return (
        <form className="search">
            <input 
            type="text" 
            placeholder="Search News" 
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
            />
            <button 
            className="search-btn" 
            type="submit"
            onClick={handleSearch}
            >Search</button>
        </form>
    )
}

export default SearchNews
