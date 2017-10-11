import React, { Component } from 'react';
import { Table, Tr, Td, Th, Thead } from 'reactable';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      forms: []
    }
  }

  componentDidMount() {
    fetch('/api/admin').then(res => res.json()).then(json => this.setState(json))
  }

  render() {
  }
}
