import styled from 'styled-components'

export const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: #f1f1f1;
  padding-top: 1.2rem;
  padding-right: 1.2rem;
  overflow: hidden;

  display: grid;
  grid-template-columns: 8rem 1fr;
  grid-template-rows: 1fr 6rem;
`

export const BottomMenu = styled.div`
  user-select: none;
  grid-column-start: 1;
  grid-column-end: 3;
  padding: 1.2rem;

  display: flex;
  justify-content: end;
  align-items: center;

  a {
    padding: 0.4rem;
    font-size: 2rem;
    background-color: #bbbbbb;
    border-radius: 0.8rem;
  }
`
