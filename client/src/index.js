import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const appRoot = document.getElementById('app');

const HelloWorld = () => (
  <h1 className='title title_size_l'>
    Hello, world! This is time
  </h1>
);

ReactDOM.render(<HelloWorld />, appRoot);