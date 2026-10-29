import Header from '../components/Header'
import Footer from '../components/Footer'
import SearchNews from '../components/SearchNews'
import Navigation from '../components/Navigation'
import '../css/SearchPage.css'
import { useState, useEffect } from 'react'
import NewsCard from '../components/NewsCard'



function SearchPage() {
// useState()------------------------------------------------
const [newsList, setNewsList] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
// Regex to filter news with arabic title--------------------------------
const arabicRegex= /^[\u0600-\u06FF\s0-9.,!?]+$/;
// API key
const key='zof9YfvPBwqxZuxm5xq3-WMyC-uSETnovJpCg3KjjrvT2ZSg';

// API endpoint
const endpoint="https://api.currentsapi.services/v2/search?"

// handleSearch function--------------------------------------------------
const handleSearch=(searchQuery)=>{
        setSearchQuery(searchQuery);
        console.log(searchQuery);
    }

// getNews function--------------------------------------------------
const getNews=async(options)=>{

    // console.log(isLoading);
  fetch(
    `${endpoint}language=${options.language}&page_size=${options.page_size}&query=${options.query}&page=${options.page}`,
    {
      headers: { Authorization: `Bearer ${key}` },
    },
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data.news);
        const news = data.news.filter((item)=>arabicRegex.test(item.title));
        console.log(news);
            setNewsList(news);
        // setIsLoading(false);

    });


}
// getNews();
// console.log(newsList);

// console.log(isLoading);

//useEffect()


// const handleCategory=(category)=>{
//     console.log(category);
//     setCategory(category);
// }

useEffect(()=>{

    let options={
        language:'ar',
        page_size:20,
        category: '',
        page:1,
        type: 2,
        query: searchQuery
    }
    //handle all states


    getNews(options);
}, [searchQuery]);


    return (
        <>
            <Header />
            <Navigation />
            <main className='search-main'>
            <SearchNews 
            onHandleSearch={handleSearch}
            
            />
<ul className="news-list">
                    {/* {newsArt.map((newsItem)=>(
                        <NewsCard 
                        {...newsItem} 
                        
                        key={newsItem.id} />
                    ))} */}
                    {
                        //check if newsList is empty + isLoading
                        
                    }
                    {newsList.length === 0 && <h3>No news found</h3>}

                    {newsList.map((newsItem)=>(
                        <NewsCard 
                        {...newsItem} 
                        key={newsItem.id}  
                        />
                    ))}
                    </ul>
            </main>

            <Footer />
        </>
    )
}

export default SearchPage