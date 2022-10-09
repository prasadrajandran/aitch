import prettier from 'prettier';
import { hStyle } from '../dist';

const testData = {
  'Parses a single block': {
    div: {
      fontSize: '10px',
    },
  },
  'Parses multiple blocks': {
    div: {
      fontSize: '10px',
    },
    p: {
      display: 'flex',
      flexDirection: 'column',
      fontSize: '10px',
      fontFamily: "'Bungee Shade', system-ui",
    },
  },
  'Parses block with multiple selectors': {
    'div, p': {
      fontSize: '10px',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Bungee Shade', system-ui",
    },
  },
  'Parses blocks under a media query': {
    '@media (height: 360px)': {
      div: {
        fontSize: '10px',
      },
      p: {
        display: 'flex',
        flexDirection: 'column',
        fontSize: '10px',
      },
    },
  },
  'Parses animation keyframes': {
    '@keyframes slideIn': {
      from: {
        transform: 'translateX(0%)',
      },
      to: {
        transform: 'translateX(100%)',
      },
    },
  },
};

const runAndFormat = (data) => prettier.format(hStyle(data), { parser: 'css' });

describe('hStyle()', () => {
  test('Expects an argument', () => {
    expect(() => hStyle()).toThrowError();
  });

  test('Parses empty object', () => {
    expect(runAndFormat({})).toMatchSnapshot();
  });

  for (const [testName, data] of Object.entries(testData)) {
    test(testName, () => {
      expect(runAndFormat(data)).toMatchSnapshot();
    });
  }
});
