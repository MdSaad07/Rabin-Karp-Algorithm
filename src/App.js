import React, { useState } from 'react';
import './App.css';

const PRIME = 101;

function App() {
  const [text, setText] = useState('');
  const [pattern, setPattern] = useState('');
  const [result, setResult] = useState('');

  const calculateHash = (str, length) => {
    let hashValue = 0;
    for (let i = 0; i < length; i++) {
      hashValue += str.charCodeAt(i) * power(PRIME, i);
    }
    return hashValue;
  };

  const recalculateHash = (str, oldIndex, newIndex, oldHash, patternLength) => {
    let newHash = oldHash - str.charCodeAt(oldIndex);
    newHash /= PRIME;
    newHash += str.charCodeAt(newIndex) * power(PRIME, patternLength - 1);
    return newHash;
  };

  const power = (base, exponent) => {
    let result = 1;
    while (exponent > 0) {
      if (exponent & 1) {
        result *= base;
      }
      base *= base;
      exponent >>= 1;
    }
    return result;
  };

  const rabinKarpSearch = () => {
    let res = '';
    const textLength = text.length;
    const patternLength = pattern.length;
    const patternHash = calculateHash(pattern, patternLength);
    let textHash = calculateHash(text, patternLength);

    for (let i = 0; i <= textLength - patternLength; i++) {
      if (patternHash === textHash && text.substr(i, patternLength) === pattern) {
        res += `Pattern found at index: ${i}\n`;
      }
      
      if (i < textLength - patternLength) {
        textHash = recalculateHash(text, i, i + patternLength, textHash, patternLength);
      }
    }
    setResult(res);
  };

  const detectIntrusion = () => {
    let res = '';
    if (detectIntrusionAlgorithm(pattern, text)) {
      res = 'Intrusion detected!\n';
    } else {
      res = 'No intrusion detected.\n';
    }
    setResult(res);
  };

  const detectIntrusionAlgorithm = (pattern, text) => {
    const patternLen = pattern.length;
    const textLen = text.length;
    let patternHash = 0;
    let textHash = 0;
    const d = 256;
    let h = 1;

    for (let i = 0; i < patternLen - 1; i++) {
      h = (h * d) % PRIME;
    }

    for (let i = 0; i < patternLen; i++) {
      patternHash = (d * patternHash + pattern.charCodeAt(i)) % PRIME;
      textHash = (d * textHash + text.charCodeAt(i)) % PRIME;
    }

    for (let i = 0; i <= textLen - patternLen; i++) {
      if (patternHash === textHash) {
        let j;
        for (j = 0; j < patternLen; j++) {
          if (text[i + j] !== pattern[j]) {
            break;
          }
        }
        if (j === patternLen) {
          return true;
        }
      }

      if (i < textLen - patternLen) {
        textHash = (d * (textHash - text.charCodeAt(i) * h) + text.charCodeAt(i + patternLen)) % PRIME;
        if (textHash < 0) {
          textHash += PRIME;
        }
      }
    }
    return false;
  };

  const plagiarismCheck = () => {
    let res = '';
    const prime = 101;
    const textLen = text.length;
    const patternLen = pattern.length;
    let patternHash = 0;
    let textHash = 0;

    for (let i = 0; i < patternLen; i++) {
      patternHash += pattern.charCodeAt(i);
      textHash += text.charCodeAt(i);
    }

    for (let i = 0; i <= textLen - patternLen; i++) {
      if (patternHash === textHash) {
        let j;
        for (j = 0; j < patternLen; j++) {
          if (text[i + j] !== pattern[j]) {
            break;
          }
        }
        if (j === patternLen) {
          res += `Plagiarism detected at index ${i}\n`;
          
        }
      }
      

      if (i < textLen - patternLen) {
        textHash = textHash - text.charCodeAt(i) + text.charCodeAt(i + patternLen);
      }
    }
    
    setResult(res);
  };

  return (
    <div className="App">
      <h1>Rabin-Karp Algorithm</h1>
      <div>
        <label htmlFor="text">Enter the text:</label>
        <input
          type="text"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="pattern">Enter the pattern to find:</label>
        <input
          type="text"
          id="pattern"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
        />
      </div>
      <button onClick={rabinKarpSearch}>Execute Rabin-Karp Algorithm</button>
      <button onClick={detectIntrusion}>Execute Intrusion Detection</button>
      <button onClick={plagiarismCheck}>Execute Plagiarism Check</button>
      <div id="result">
        <pre>{result}</pre>
      </div>
    </div>
  );
}

export default App;
