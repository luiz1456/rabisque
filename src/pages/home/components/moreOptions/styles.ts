import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .logo h1 {
    font-family: 'Playwrite HU', cursive;
    font-size: 28px;
    padding-left: 2.4rem;
    user-select: none;
  }

  .containerButtons {
    padding-right: 2.4rem;
    display: flex;
  }

  @media (width <= 560px) {
    .logo h1 {
      font-size: 24px;
      padding-left: 1.2rem;
    }
  }
`

export const ButtonsLineWithDots = styled.div`
  display: flex;
  gap: 0.8rem;
  background-color: #dcdcdc;
  padding: 0.8rem;
  border-radius: 2.4rem;

  button {
    border: 0.2rem solid #444444;
    line-height: 0;
    font-size: 1.6rem;
    padding: 0.4rem;
    border-radius: 100%;
    color: #444444;

    &:hover {
      color: #000000;
      border-color: #000000;
    }
  }

  button.x {
    margin-left: 1.2rem;
    position: relative;

    &::before {
      content: '';
      height: 100%;
      width: 0.15rem;
      border-radius: 0.4rem;
      background-color: #444444;
      position: absolute;
      top: 0;
      left: -1.2rem;
    }
  }
`

export const ButtonsFillShape = styled.div`
  & > div {
    background-color: #dcdcdc;
    padding: 1.2rem;
    border-radius: 2rem;
    display: flex;
    gap: 0.8rem;

    button {
      border: none;
      font-size: 2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      color: #333333;
      background-color: transparent;
    }

    button:hover {
      color: #000;
    }

    button.active {
      color: #000;
    }

    button .arrowleft {
      position: absolute;
      top: -1.8rem;
      display: none;
    }
    button.active .arrowleft {
      display: block;
    }
  }
`
