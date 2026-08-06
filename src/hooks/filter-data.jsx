

export function useFilterData(searchString, data){
     let filteredData = data.map(item=> item.toLowerCase().includes(searchString.toLowerCase()));
     if(searchString===''){
         return data;
     } else {
        return filteredData;
     }
}