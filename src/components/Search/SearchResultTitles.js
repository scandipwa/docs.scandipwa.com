import { default as React, useEffect, useState } from "react"
import { media } from 'theme'
import { connectHits } from "react-instantsearch-dom"
import './Search.css'


const useKeyPress = (targetKey) => {
    const [keyPressed, setKeyPressed] = useState(false);

    const downHandler = (e) => {
        if (e.key === "Enter" || e.key === "Tab") {
            e.preventDefault()
        }
        if (e.key === targetKey) {
            setKeyPressed(true)
        }
    }
    const upHandler = (e) => {
        if (e.key === "Enter" || e.key === "Tab") {
            e.preventDefault()
        }
        if (e.key === targetKey) {
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

const HitsInIndex = ({ hits }) => {

    const downPress = useKeyPress("ArrowDown");
    const upPress = useKeyPress("ArrowUp");
    const enterPress = useKeyPress("Enter");
    const tabPress = useKeyPress("Tab");
    const [cursor, setCursor] = useState(0);
    const [activeLinkUrl, setActiveLinkUrl] = useState('')
    let quantity = null;

    useEffect(() => {
        if (hits.length && (downPress || tabPress)) {
            setCursor(cursor < quantity ? cursor + 1 : 0);
        }
    }, [downPress]);

    useEffect(() => {
        if (hits.length && upPress) {
            setCursor(cursor > 0 ? cursor - 1 : quantity);
        }
    }, [upPress]);

    useEffect(() => {
        if (activeLinkUrl && (enterPress || tabPress)) {
            window.location.href = activeLinkUrl
        }
    }, [enterPress, tabPress])




    const getShortDescription = (description) => {
        if (description.includes('<')) {
            description = description.replace(/<\S+>(.+?)<\/\S+>/gi, '$1')
        }
        if (description && description.split(' ').length > 10) {
            const newDescription = description.split(' ').slice(0, 9).join(' ')
            if ([',', '.'].some(sym => newDescription.endsWith(sym))) {
                return newDescription.slice(0, -1) + '...'
            }

            else {
                return newDescription + '...'
            }
        }
        return description
    }


    return (
        <>
            <div className="FoundIn">
                <h2>
                    Found in:
                </h2>
            </div>
            <div>
                <div>
                    {hits.filter((hit, i) => hit.title !== 'Page Not Found' && i < 5).map((hit, i) => {
                        quantity = i

                        if (i === 0 && !activeLinkUrl) setActiveLinkUrl(hit.slug)
                        else if (i === cursor && activeLinkUrl !== hit.slug) setActiveLinkUrl(hit.slug)



                        return (
                            <a key={i}href={hit.slug} >
                                <div

                                    className={`resultHit ${i === cursor ? "active" : ""}`}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '37% 61%',
                                        gridGap: '2%',
                                        margin: '10px 0',
                                    }}>
                                    <div
                                        css={{
                                            fontSize: 20,
                                            color: '#777',
                                            paddingLeft: 20,
                                            [media.lessThan('large')]: {
                                                fontSize: 16,
                                            },
                                            [media.lessThan('medium')]: {
                                                fontSize: 16,
                                            },
                                        }}>
                                        {hit.title}
                                    </div>
                                    <div css={{
                                        fontSize: 20,
                                        [media.lessThan('large')]: {
                                            fontSize: 16,
                                        },
                                        [media.lessThan('medium')]: {
                                            fontSize: 16,
                                        },
                                    }}>
                                        {getShortDescription(hit.description)}
                                    </div>
                                </div>

                            </a >
                        )
                    })}
                </div>
            </div>
        </>
    )
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
                    />
                    : <div css={{ textAlign: 'center', margin: '10px 0' }}>No results found</div>
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
                maxHeight: 600,
                overflow: 'auto',
                position: 'absolute',
                zIndex: 2,
                borderBottomRightRadius: 5,
                borderBottomLeftRadius: 5,
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
                    <AllHits
                        index={index}
                        query={query} />
                </React.Fragment>
            ))}
        </div>
    )
}

export default SearchResult