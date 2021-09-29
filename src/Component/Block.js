import styled from 'styled-components'

const Outter = styled.div`
    background-color: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.0975);
`

const Inner = styled.div`
    height: 240px;
    padding: 20px 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    margin: 0 auto;
`

export default function App({ title, children }) {
    return (
        <Outter>
            <h4>{title}</h4>
            <Inner>{children}</Inner>
        </Outter>
    )
}
