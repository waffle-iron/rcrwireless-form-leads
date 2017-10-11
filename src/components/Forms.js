import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Redirect } from 'react-router';

class Forms extends Component {
  constructor(props) {
    super(props)
    this.state = {
      navigate: false
    }
    this.handleFormClick = this.handleFormClick.bind(this)
  }

  columns() {
    if (this.props.forms.length) {
      return Object.keys(this.props.forms[0]).map(field => {
        return { Header: field, accessor: field }
      })
    } else return [];
  }

  handleFormClick(e, state, rowInfo, column, instance) {
    // console.log('here')
    this.setState({
      formId: rowInfo.original.id,
      navigate: true
    });
  }

  render() {
    const { navigate, formId } = this.state
    if (navigate && formId) {
      return <Redirect to={`/forms/${formId}`} push={true} />
    }

    return (
      <ReactTable
        data={this.props.forms}
        columns={this.columns()}
        defaultPageSize={10}
        className="-striped -highlight"
        getTdProps={
          (state, rowInfo, column, instance) => {
            return { onClick: e => {
              return this.handleFormClick(e, state, rowInfo, column, instance)
            }}
          }
        }
      />
    )
  }
}

Forms.propTypes = {
  forms: PropTypes.array.isRequired
}

export default Forms
