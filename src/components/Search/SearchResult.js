import { default as React, useEffect, useState } from "react"
import { media } from 'theme'
import { connectHits, Highlight } from "react-instantsearch-dom"
import './Search.css'

const ignoreStrings = ['Watch the tutorial', 'Watch an explanation video', 'Watch video', 'Watch the video tutorial']

const HitsInIndex = ({ query, hits }) => {

    const [selected, setSelected] = useState(undefined);
    const downPress = useKeyPress("ArrowDown");
    const upPress = useKeyPress("ArrowUp");
    const enterPress = useKeyPress("Enter");
    const [cursor, setCursor] = useState(0);
    const [hovered, setHovered] = useState(undefined);

    useEffect(() => {
        if (hits.length && downPress) {
            setCursor(prevState =>
                prevState < hits.length - 1 ? prevState + 1 : prevState
            );
        }
    }, [downPress]);
    useEffect(() => {
        if (hits.length && upPress) {
            setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
        }
    }, [upPress]);
    useEffect(() => {
        if (hits.length && enterPress) {
            setSelected(hits[cursor]);
        }
    }, [cursor, enterPress]);
    useEffect(() => {
        if (hits.length && hovered) {
            setCursor(hits.indexOf(hovered));
        }
    }, [hovered]);



    return (
        <>
            {hits.map((hit, i) => {

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
                        onClick={() => setSelected(item)}
                        // onMouseEnter={() => setHovered(item)}
                        // onMouseLeave={() => setHovered(undefined)}
                        className={`resultHit ${i === cursor ? "active" : ""}`}
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
                                    // borderRight: '1px solid #999',
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
        </>
    )
}

const useKeyPress = (targetKey) => {
    const [keyPressed, setKeyPressed] = useState(false)

    const downHandler = ({ key }) => {
        if (key === targetKey) {
            setKeyPressed(true)
        }
    }
    const upHandler = ({ key }) => {
        if (key === targetKey) {
            setKeyPressed(false)
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", downHandler)
        window.addEventListener("keyup", upHandler)

        return () => {
            window.removeEventListener("keydown", downHandler)
            window.removeEventListener("keyup", upHandler)
        }
    })

    return keyPressed
}


const HitsOrAbsence = ({ hits, index, query }) => {

    return (
        <>
            {
                !!hits[0]
                    ? <HitsInIndex
                        index={index}
                        query={query}
                        hits={hits}
                        // pressedKey={pressedKey}
                    />
                    : <div css={{ textAlign: 'center', marginTop: 10 }}>No results found</div>
            }
        </>
    )
}

const AllHits = connectHits(HitsOrAbsence)


const SearchResult = ({ indices, show, query }) => {

    if (!show) {
        return null
    }

    return (
        <div
            className="searchResult"
            css={{
                display: 'block',
                right: 0,
                width: 600,
                maxHeight: 400,
                overflow: 'scroll',
                // position: 'absolute',
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
                    width: "350",
                    // position: 'static',

                },
            }}
        >
            {indices.map(index => (
                <React.Fragment key={index.name}>
                    <AllHits
                        // pressedKey={pressedKey}
                        index={index}
                        query={query} />
                </React.Fragment>
            ))}
        </div>
    )
}

export default SearchResult