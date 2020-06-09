import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  header {
    height: 144px;
    background: #28262e;

    display: flex;
    align-items: center;

    div {
      max-width: 1120px;
      width: 100px;
      margin: 0 auto;
      flex: 1;
    }
    a {
      color: #f4ede8;
      display: inline-block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.3s;

      svg {
        margin-right: 16px;
      }

      &:hover {
        color: ${shade(0.2, '#F4EDE8')};
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: -176px auto 0;

  width: 100%;
`;

const fade = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

export const Animation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${fade} 1s;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
      margin-bottom: 20px;
      text-align: left;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.3s;

      &:hover {
        color: ${shade(0.2, '#F4EDE8')};
      }
    }
  }
`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  width: 186px;
  position: relative;
  height: 186px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: ${shade(0.5, '#f4ede8')};

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  label {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 48px;
    height: 48px;
    background: #ff9000;
    border-radius: 50%;
    right: 0;
    bottom: 0;
    padding: 0;
    margin: 0;
    cursor: pointer;
    transition: background 0.5s;
    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }

    input {
      display: none;
    }

    svg {
      color: #312e38;
    }
  }
`;
