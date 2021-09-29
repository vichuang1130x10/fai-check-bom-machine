import styled from 'styled-components'


const Nav = styled.div`
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.0975);
`;

const NavHeader = styled.div`
  max-width: 1200px;
  padding: 20px 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;


const NavSubTitle = styled.div`
  color: #606060;

`;

export default function Header(props) {
  return (
    <Nav>
      <NavHeader>
        <NavSubTitle>
          <h2>BOM Compare With Machine Data</h2>
        </NavSubTitle>
      </NavHeader>
    </Nav>
  );
}
