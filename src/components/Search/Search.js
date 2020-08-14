import algoliasearch from "algoliasearch/lite"
import { createRef, default as React, useState } from "react"
import { InstantSearch } from "react-instantsearch-dom"
import SearchBox from "./SearchBox"
import SearchResult from "./SearchResult"
import SearchResultTitles from "./SearchResultTitles"
import useClickOutside from "./useClickOutside"

export default function Search({ indices }) {
    const rootRef = createRef()
    const [query, setQuery] = useState()
    const [fieldValue, setFieldValue] = useState('')
    const [hasFocus, setFocus] = useState(false)
    const searchClient = algoliasearch(
        process.env.GATSBY_ALGOLIA_APP_ID,
        process.env.GATSBY_ALGOLIA_SEARCH_KEY
    )

    useClickOutside(rootRef, () => setFocus(false))

    return (
        <div
            ref={rootRef}
            css={{
            position: 'relative',
        }}>
            <InstantSearch
                searchClient={searchClient}
                indexName={indices[0].name}
                onSearchStateChange={({ query }) => setQuery(query)}
            >
                <SearchBox
                    setQuery={setQuery}
                    fieldValue={fieldValue}
                    setFieldValue={setFieldValue}
                    setFocus={setFocus}
                    onFocus={() => setFocus(true)}
                    hasFocus={hasFocus} />
                <SearchResultTitles
                    query={query}
                    show={!!query}
                    indices={indices}
                />
            </InstantSearch>
        </div>
    )
}