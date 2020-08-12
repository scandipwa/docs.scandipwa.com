import { default as React } from "react"
import { media } from 'theme'
import {
    Index,
    connectHits,
} from "react-instantsearch-dom"
import './Search.css'

const ignoreStrings = ['Watch the tutorial', 'Watch an explanation video', 'Watch video', 'Watch the video tutorial']

const HitsInIndex = ({ index, query, hits }) => (
    <Index style={{ position: 'absolute' }} indexName={index.name}>
        {hits.map(hit => {
            const onLink = (url) => e => {
                e.preventDefault()
                window.location.href = url
            }

            const getLink = (title) => {
                return `${hit.slug}#${title.replace(/\s/ig, '-').replace(/[\?!.<>,’]/ig, '').toLowerCase()}`
            }

            const headings = hit.headings
                .filter(({ value }) => {
                    if (!value || ignoreStrings.some(string => string.includes(value))) {
                        return false
                    }
                    return value.toLowerCase().includes(query)
                })
                .map(({ value }, i) => {
                    if (value.includes('<code class')) {
                        value = value.split('>')[1].split('<')[0]
                    }

                    return (
                        <a key={i} className="resultLink" href={getLink(value)} onClick={onLink(getLink(value))}  >
                            <h5
                                css={{
                                    marginBottom: 10
                                }}>
                                {value}
                            </h5>
                        </a>
                    )
                })
            if (headings.length === 0) {
                headings.push(
                    <a key={1} className="resultLink" href={getLink(hit.title)} onClick={onLink(getLink(hit.title))} >
                        <h5>{hit.title}</h5>
                    </a>
                )
            }

            return (
                <div
                    className="resultHit"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '37% 61%',
                        gridGap: '2%',
                        margin: '10px 0',
                    }}>
                    <a href={getLink(hit.title)} onClick={onLink(getLink(hit.title))} >
                        <div
                            css={{
                                fontSize: 20,
                                color: '#777',
                                paddingLeft: 20,
                                borderRight: '1px solid #999',
                                [media.lessThan('large')]: {
                                    fontSize: 16,
                                },
                                [media.lessThan('medium')]: {
                                    fontSize: 16,
                                },
                            }}>
                            {hit.title}
                        </div>
                    </a >
                    <div css={{
                        fontSize: 20,
                        [media.lessThan('large')]: {
                            fontSize: 16,
                        },
                        [media.lessThan('medium')]: {
                            fontSize: 16,
                        },
                        'hover': {
                            marginRight: '-3px'
                        },
                    }}>
                        {headings}
                    </div>
                </div>
            )
        })}
    </Index>
)


const HitsOrAbsence = ({ hits, index, query }) => {

    return (
        <>
            {
                !!hits[0]
                    ? <HitsInIndex index={index} query={query} hits={hits} />
                    : <div css={{ textAlign: 'center', marginTop: 10 }}>No results found</div>
            }
        </>
    )
}

const HitsIn = connectHits(HitsOrAbsence)


const SearchResult = ({ indices, show, query }) => {

    // if (!show) {
        // return null
    // }

    return (
        <div
            className="searchResult"
            css={{
                display: 'block',
                right: 0,
                width: 600,
                maxHeight: 400,
                overflow: 'scroll',
                position: 'absolute',
                zIndex: 2,
                borderRadius: 5,
                boxShadow: 'inset 0 0 10px #ddd',
                top: '100%',
                backgroundColor: '#fff',
                color: '#000',
                [media.lessThan('large')]: {
                    width: 450,
                },
                [media.lessThan('medium')]: {
                    width: 350,
                },
            }}
        >
            {indices.map(index => (
                <React.Fragment key={index.name}>
                    <HitsIn index={index} query={query} />
                </React.Fragment>
            ))}
        </div>
    )
}

export default SearchResult