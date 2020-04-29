import React ,{Component} from 'react';
import Nav from './components/Nav';
import Video from './components/Video';
//const React = require('react');

class App extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
     return (
      <div>
      <Nav/>
            <Video/>
      </div>
    );
  }
}


export default App;
