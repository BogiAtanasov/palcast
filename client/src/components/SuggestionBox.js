import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Loader from "react-loader-spinner";
const Inbox = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
      getInitialSuggestions();
  }, []);

  const getSuggestions = async (localcategory) => {
    setLoading(true);
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const body = JSON.stringify({category: localcategory});

    const res = await axios.post('/api/catalog/suggestions', body, config);

    var articles = res.data.articles;
    for(var article of articles){
      article['read'] = false;
    }
    setCategory(localcategory);
    setLoading(false);
    setSuggestions(articles);

  }

  const getInitialSuggestions = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const body = JSON.stringify({category: category});

    const res = await axios.post('/api/catalog/suggestions', body, config);

    var articles = res.data.articles;
    for(var article of articles){
      article['read'] = false;
    }

    setSuggestions(articles);

  }

  const markRead = (index) => {
    suggestions[index].read = !suggestions[index].read;
    setSuggestions([...suggestions]);
  }

  return (
    <div className="suggestions_container">
    <h2 className="suggestion_header">Discussion suggestions</h2>
    <div className="suggestion_categories">
      <div onClick={()=>getSuggestions('general')} className={`suggestion_category ${category == "general" && 'selected_category'}`} >General</div>
      <div onClick={()=>getSuggestions('entertainment')} className={`suggestion_category ${category == "entertainment" && 'selected_category'}`} >Entertainment</div>
      <div onClick={()=>getSuggestions('business')} className={`suggestion_category ${category == "business" && 'selected_category'}`} >Business</div>
      <div onClick={()=>getSuggestions('technology')} className={`suggestion_category ${category == "technology" && 'selected_category'}`} >Technology</div>
      <div onClick={()=>getSuggestions('sports')} className={`suggestion_category ${category == "sports" && 'selected_category'}`} >Sports</div>
      <div onClick={()=>getSuggestions('science')} className={`suggestion_category ${category == "science" && 'selected_category'}`} >Science</div>
      <div onClick={()=>getSuggestions('health')} className={`suggestion_category ${category == "health" && 'selected_category'}`} >Health</div>
    </div>
      <div className="suggestions">
        {!loading && suggestions.map((elem, index) => {
          return (
            <div className="suggestionLink">
                  <input onClick={()=>markRead(index)} id={`checkbox-${index}`} type="checkbox"/>
                  <label class="checkbox" for={`checkbox-${index}`}><a style={{textDecoration: `${elem.read ? "line-through" : "none"}`}} href={elem.url}>{elem.title}</a></label>
            </div>
          )
        })}
        {(suggestions.length == 0 || loading) &&
        <div className="spinner_container">
          <Loader
          type="Oval"
          color="#FEBA38"
          height={50}
          width={50}
        />
        </div>
        }
      </div>

    </div>
  )
}


export default Inbox;
