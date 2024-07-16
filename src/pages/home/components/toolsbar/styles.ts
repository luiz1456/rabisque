import styled from 'styled-components'

export const ToolsbarStyled = styled.div`
  user-select: none;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 1.6rem;
  gap: 1.2rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0.8rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #666666;
    border: 0.3rem solid #f1f1f1;
    border-radius: 0.4rem;
  }

  & > *:not(:last-child) {
    width: 100%;
    padding-bottom: 0.4rem;
    border-bottom: 0.2rem solid #cccccc;
  }

  .containerInputRange {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 0.4rem;

    input[type='range'] {
      writing-mode: vertical-lr;
      direction: rtl;
      height: 100px;
      filter: grayscale(1);
    }
  }

  span {
    font-size: 1.2rem;
    font-family: sans-serif;
    font-weight: 600;
  }

  button {
    border: none;
    font-size: 2.4rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  button:not(.trash, .arrowUndo) {
    color: #777777;
  }

  button:hover {
    color: #000;
  }

  button.active {
    color: #000;
  }

  button .arrowleft {
    position: absolute;
    right: -0.8rem;
    display: none;
  }
  button.active .arrowleft {
    display: block;
  }

  .containerInputColor {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    text-align: center;

    input[type='color'] {
      width: 2rem;
      height: 2rem;
      border: none;
      border-radius: 100%;
      box-shadow: 0rem 0rem 0rem 0.2rem #999999;
    }
    input[type='color']::-webkit-color-swatch {
      border: none;
      width: 2rem;
      height: 2rem;
      border-radius: 100%;
    }

    input[type='color']::-webkit-color-swatch-wrapper {
      padding: 0;
    }
  }

  @media (width <= 560px) {
    button .arrowleft {
      right: -1.4rem;
    }
  }
`
