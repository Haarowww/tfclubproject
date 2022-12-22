import SearchBar from 'material-ui-search-bar';
import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";

function Search() {
	let history = useNavigate();
	const [data, setData] = useState({ search: '' });

	const goSearch = (e) => {
		history({
			pathname: '/search/',
			search: '&search=' + data.search,
		});
		window.location.reload();
	};
    return (
        <SearchBar
            value={data.search}
            onChange={(newValue) => setData({ search: newValue })}
            onRequestSearch={() => goSearch(data.search)}
        />
    )
}

export default Search;