import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Redirect } from 'react-router';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Col, Form,
  FormGroup, Label, Input, FormText
} from 'reactstrap';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      user: {}
    };

    this.toggle = this.toggle.bind(this);
    this.saveUser = this.saveUser.bind(this);
    this.changeUsername = this.changeUsername.bind(this)
    this.changeUsername = this.changeUsername.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.toggleAdmin = this.toggleAdmin.bind(this)
  }

  toggle(e) {
    let user = {};
    if (e) {
      user = this.props.users.find(user => user._id === e.target.getAttribute('data-user-id')) || {};
    }
    this.setState({
      modal: !this.state.modal,
      user
    });
  }

  saveUser(e) {
    e.preventDefault();
    this.props.saveUser(this.state.user)
    this.toggle();
  }

  changeUsername(e) {
    this.setState({
      user: Object.assign({}, this.state.user, { username: e.target.value })
    })
  }

  handleSelectChange(options) {
    this.setState({
      user: Object.assign({}, this.state.user, {forms: options.map(option => option.value)})
    })
  }

  toggleAdmin(e) {
    this.setState({
      user: Object.assign({}, this.state.user, { admin: e.target.checked })
    })
  }

  columns() {
    if (this.props.users.length) {
      return Object.keys(this.props.users[0]).map(field => {
        return { Header: field, accessor: field }
      }).concat([{Header: 'Edit', Cell: row => {
        return <Button color="info" onClick={this.toggle} data-user-id={row.original._id}>edit</Button>
      }}])
    } else return [];
  }

  forms() {
    return this.props.forms.map(form => {return {value: form.id, label: form.name }})
  }

  render() {
    return (
      <div>
        <ReactTable
          data={this.props.users}
          columns={this.columns()}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
          <Form>
            <ModalBody>
              <FormGroup row>
                <Label for="email" sm={2}>Email</Label>
                <Col sm={10}>
                  <Input type="email" name="username" id="email" placeholder="email" defaultValue={this.state.user.username} onChange={this.changeUsername}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="forms" sm={2}>Forms</Label>
                <Col sm={10}>
                <Select
                  multi
                  onChange={this.handleSelectChange}
                  options={this.forms()}
                  placeholder="Select forms"
                  value={this.state.user.forms}
                />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="admin" sm={2}>Admin</Label>
                <Col sm={{ size: 10 }}>
                  <FormGroup check>
                    <Input type="checkbox" id="admin" name="admin" onChange={this.toggleAdmin} defaultChecked={this.state.user.admin}/>
                  </FormGroup>
                </Col>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.saveUser}>Submit</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    )
  }
}

Users.propTypes = {
  users: PropTypes.array.isRequired,
  forms: PropTypes.array.isRequired,
}

export default Users
