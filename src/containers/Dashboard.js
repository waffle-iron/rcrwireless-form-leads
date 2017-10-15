import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchForms } from '../actions';
import Forms from '../components/Forms';
import { Container } from 'reactstrap';

class Dashboard extends Component {

  componentDidMount() {
    this.props.dispatch(fetchForms());
  }

  render() {
    const { forms } = this.props;
    return (
      <Container>
        <h1 className="text-center">Your Forms</h1>
        <Forms forms={forms} />
      </Container>
    )
  }
}

Dashboard.propTypes = {
  forms: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { forms } = state
  return { forms }
}

export default connect(mapStateToProps)(Dashboard)
