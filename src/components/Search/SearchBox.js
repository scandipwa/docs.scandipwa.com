import React, { useRef } from "react"
import { connectSearchBox } from "react-instantsearch-dom"
import './Search.css'
import search from "./../../images/search.png"
import { media } from 'theme'



export default connectSearchBox(
    ({ refine, onFocus, setQuery, fieldValue, setFieldValue }) => {

        const onChange = (e) => {
            setFieldValue(e.target.value)
            refine(e.target.value)
        }

        const inputRef = useRef();

        const focusInput = () => {
            inputRef.current.focus()
        }

        const cleanField = () => {
            setTimeout(() => {
                setQuery('')
                setFieldValue('')
            }, 500)
        }

        return (
            <form className="searchForm">
                <input
                    css={{
                        [media.lessThan('expandedSearch')]: {
                            width: 20,
                            transition: 'width .2s ease-in',
                            ':focus': {
                                width: '160px'
                            }
                        }
                    }}
                    onBlur={cleanField}
                    className="searchInput"
                    type="text"
                    placeholder="Search"
                    aria-label="Search"
                    onChange={onChange}
                    value={fieldValue}
                    ref={inputRef}
                    onFocus={onFocus}
                />
                <span onClick={focusInput} css={{cursor: 'text'}} className="magGlass">
                    <img src={search} css={{ width: 15 }} />
                </span>
            </form>
        )
    }
)