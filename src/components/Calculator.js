import '../assets/css/App.css';
import React, { Component } from 'react';

const maxLength = 8;
const numberArray = n => Array.from({length: n}, (value, key) => key)
const operatorArray = [
  {
    operator: (a,b) => {return b*a},
    value: '\u00D7',
    name: 'multiply'
  },{
    operator: (a,b) => {return b+a},
    value: '\u002B',
    name: 'add'
  },{
    operator: (a,b) => {return b-a},
    value: '\u2212',
    name: 'subtract'
  },{
    operator: (a,b) => {return b/a},
    value: '\u00f7',
    name: 'divide'
  }
]

const defaultState = {
  result: 0, //result of any operations,
  entry: false, //current typed in. Will show result if no value.
  factor: false, //stored after operator called
  display: [0], //display representation of value, or result if no value
  operator: false, //function to carry out calculation
  decimal: false //tracks if decimal represntation used.
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  getValue(number) {
    this.setState((prevState,props)=>{
      let newProps = {factor: false};
      let display = prevState.display;
      let num = String(number);
      if (!prevState.entry) {
        newProps = {
          display: [num],
          entry: parseFloat(num),
          factor: parseFloat(num),
        }
      } else if (this.characterSpace(display)) {
        let idx = prevState.decimal ? 2 : 0;
        display[idx] = (display[idx] ? display[idx] : '') + num;
        newProps = {
          entry: getFloat(display),
          factor: false,
          display: display,
          // operator: false, //clears
        }
      }
      return newProps
    })
  }

  clearAll() {
    this.setState(defaultState);
  }

  clearEntry() {
    this.setState({
      factor: false,
      entry: false,
      display: [0],
    });
  }

  addDecimal() {
    this.setState((prevState,props)=>{
      if (!prevState.decimal) {
        let display = prevState.display;
        display[1] = decimalSpan;
        return {
          entry: String(display),
          display: display,
          decimal: true,
          operator: prevState.entry ? prevState.operator : false,
        }
      }
    });
  }

  characterSpace(str) {
    return str === undefined || String(str).replace(decimalSpan, '').length < maxLength;
  }

  valueToDisplay(num) {
    let arr = String(num).split('.');
    if (arr.length > 1) {
      arr[2] = arr[1];
      arr[1] = decimalSpan;
    }
    return arr;
  }

  calculate() {
    this.setState((prevState,props)=>{
      let factor = prevState.entry || prevState.factor;
      let float = prevState.operator ? prevState.operator(factor, prevState.result) : prevState.result; //do nothing if no operator
      let result = trimNum(float);
      return {
        factor: factor,
        entry: false,
        result: result,
        display: this.valueToDisplay(result)
      };
    });
  }

  operator(op) {
    this.setState((prevState,props)=>{
      return {
        decimal: false,
        operator: op,
        entry: false,
        result: prevState.result ? prevState.result : prevState.entry,
        factor: prevState.entry || prevState.result,
      }
    });
  }

  render() {
    return (
      <div>
        <div className="calculator-app">
          <h2 className="calculator-app__logo">Electrolator</h2>
          <Display display={this.state.display}/>
          <ul className="keys">
            {numberArray(10).map((i)=>{
              return <NumberKey key={'number'+i} value={i} onClick={this.getValue.bind(this, i)}/>
            })
            }
            <DecimalKey onClick={this.addDecimal.bind(this)}/>
            <ClearAllKey onClick={this.clearAll.bind(this)}/>
            <ClearEntryKey onClick={this.clearEntry.bind(this)}/>
            {operatorArray.map((obj, i )=>{
              return <Key value={obj.value} key={obj.name} name={obj.name} onClick={this.operator.bind(this, obj.operator)}/>
            })}
            <EqualsKey onClick={this.calculate.bind(this)}/>
          </ul>
        </div>
      </div>
    );
  }
}

const decimalSpan = (<span key="decimal" className="display__decimal">.</span>);

function getFloat(arr) {
  if (arr[0] === undefined) {
    return false;
  }
  let parsed = arr[0];
  if (arr[2]) {
    parsed = arr[0] + '.' + arr[2];
  }
  return parseFloat(parsed);
}

function Display(props) {
  return (
    <div className="display">
      <div className="display__number">
        {props.display.map((val, i)=> {
          return (val);
        })}
      </div>
    </div>
  );
}

function BEM(cls, str) {
  return cls + str !== undefined ? cls + ' ' + cls + '--' + str : '';
}

function trimNum(num) {
  let max = num < 1 ? maxLength+1 : maxLength; //negative numbers get extra character.
  let result = String(num).substring(0,max+1);
  if (!result.includes('.')) {
    result = result.substring(0,max);
  }
  return parseFloat(result);
}

function Key(props) {
  let outerClass = BEM('keys__item', props.name);
  let innerClass = BEM('keys__key', props.name)
  return (
    <li className={outerClass}>
      <button
        className={innerClass}
        value={props.value}
        onClick={props.onClick}>
        {props.value}
      </button>
    </li>
  );
}

function DecimalKey(props) {
  return Key({...props,
    name: 'decimal',
    value: '.'
  });
}

function NumberKey(props) {
  return Key({...props,
    name: 'number-' + props.value
  });
}

function ClearAllKey(props) {
  return Key({...props,
    name: 'clear-all',
    value: 'AC'
  });
}

function ClearEntryKey(props) {
  return Key({...props,
    name: 'clear-entry',
    value: 'CE'
  });
}

function EqualsKey(props) {
  return Key({...props,
    name: 'equals',
    value: '='
  });
}

export default Calculator;
