import styled from 'styled-components'

const Content = styled.div`
    max-width: 1200px;
    padding: 20px 20px;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
`

export default function App({ children }) {
    return <Content>{children}</Content>
}
