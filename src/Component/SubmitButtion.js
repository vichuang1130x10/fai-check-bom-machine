import styled from 'styled-components'

const Button = styled.button`
    width: 360px;
    height: 60px;
    cursor: pointer;
    background-color: white;
    color: black;
    border: 1px solid black;

    font-size: 24px;
    border-radius: 5px;

    margin: 0 1em;
    padding: 0.4em 1em;
    transition: 0.3s all ease-out;

    &:hover {
        background: #4344aa;
        color: #fff;
        border: 1px transparent;
    }

    &:disabled {
        background: #ccc;
    }
`

export default Button
