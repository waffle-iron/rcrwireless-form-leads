import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchForms, fetchUsers, updateUser } from '../actions';
import Users from '../components/Users'
import { Container } from 'reactstrap';

class Admin extends Component {

  componentDidMount() {
    this.props.dispatch(fetchUsers());
    this.props.dispatch(fetchForms());
  }

  render() {
    const { forms, users } = this.props;
    return (
      <Container>
        <h1 className="text-center">Admin</h1>
        <Users users={users} forms={forms} saveUser={(user) => this.props.dispatch(updateUser(user))}/>
      </Container>
    )
  }
}

Admin.propTypes = {
  users: PropTypes.array.isRequired,
  forms: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { forms, users } = state
  return { forms, users }
}

export default connect(mapStateToProps)(Admin)
