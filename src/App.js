import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Counter from './components/Counter';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCounter: true
    };
  }

  removeCounter() {
    this.setState({
      showCounter: false
    });
  }

  componentDidUpdate() {
    console.log('App updated');
  }

  render() {
    console.log('app render');
    return (
      <div className="App">
        <button onClick={() => this.removeCounter()}>Remove Counter</button>
        { this.state.showCounter && <Counter /> }
      </div>
    );
  }
}

export default App;
