import { useEffect, useState } from "react"
import { useFilterData } from "../hooks/filter-data";

export function Search(){

    const [topics] = useState(['HTML Tutorial', 'Javascript Projects', 'CSS Tutorial', 'HTML Projects', 'Javascript Examples']);
    const [searchString ,setSearchString] = useState('');

    function handleChange(e){
        setSearchString(e.target.value);
    }

    let filteredData = useFilterData(searchString, topics);

    useEffect(()=>{
        console.log(filteredData);
    },[searchString])

    return(
        <div className="container">
            <h3>Topics</h3>
            <input type="text" onChange={handleChange} placeholder="search topics" />
            <ul>
                {
                    filteredData.map(topic=><li key={topic}>{topic}</li>)
                }
            </ul>
        </div>
    )
}