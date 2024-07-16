import styled from 'styled-components'

export const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: #f1f1f1;
  padding-bottom: 1.2rem;
  padding-left: 1.2rem;
  overflow: hidden;

  display: grid;
  grid-template-columns: 1fr 8rem;
  grid-template-rows: 6rem 1fr;

  .download {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;

    a {
      font-size: 2.4rem;
      color: #333333;

      &:hover {
        color: #000000;
      }
    }
  }

  @media (width <= 560px) {
    grid-template-columns: 1fr 6rem;
  }
`
