import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchItems } from '../actions';
import FormLeads from '../components/FormLeads';

class Form extends Component {

  componentDidMount() {
    this.props.dispatch(fetchItems(this.props.match.params.id));
  }

  render() {
    const { items } = this.props;
    return (
      <div>
        <h1 className="text-center">Form Data</h1>
        <FormLeads items={items} />
      </div>
    )
  }
}

Form.propTypes = {
  items: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { items } = state
  return { items }
}

export default connect(mapStateToProps)(Form)
