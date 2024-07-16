import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  box-shadow: 0rem 0rem 0.4rem 0.2rem #bbbbbb;
  position: relative;
  cursor: crosshair;
  display: grid;
  grid-column-start: 1;
  grid-column-end: 2;

  canvas,
  div {
    position: absolute;
  }
`
