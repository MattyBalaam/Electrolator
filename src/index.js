import React from 'react';
import { render } from 'react-dom';
import Calculator from './components/Calculator';

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
root.id = "root";
document.body.appendChild( root );

render( <Calculator />, document.getElementById('root') );
