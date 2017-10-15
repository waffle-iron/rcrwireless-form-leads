import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactTable from "react-table";
import "react-table/react-table.css";

class FormLeads extends Component {
  columns() {
    if (this.props.items.length) {
      return Object.keys(this.props.items[0]).map(field => {
        return { Header: field, accessor: field }
      })
    } else return [];
  }

  render() {
    return (
      <ReactTable
        data={this.props.items}
        columns={this.columns()}
        defaultPageSize={10}
        className="-striped -highlight"
      />
    )
  }
}

FormLeads.propTypes = {
  items: PropTypes.array.isRequired
}

export default FormLeads
