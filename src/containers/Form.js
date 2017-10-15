import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchItems } from '../actions';
import FormLeads from '../components/FormLeads';
import { Container } from 'reactstrap';
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
const moment = require('moment');
import {CSVLink} from 'react-csv';
import { Col, Row } from 'reactstrap';


class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment().subtract(2, 'week'),
      endDate: moment(),
      focusedInput: null
    }
    this.changeDates = this.changeDates.bind(this);
  }

  changeDates({ startDate, endDate }) {
    console.log(startDate, endDate)
    this.setState({ startDate, endDate })
    if (startDate && endDate) {
      this.props.dispatch(fetchItems(this.props.match.params.id, startDate.unix(), endDate.unix()));
    }
  }

  componentDidMount() {
    this.props.dispatch(fetchItems(this.props.match.params.id, this.state.startDate.unix(), this.state.endDate.unix()));
  }

  render() {
    const { items } = this.props;
    return (
      <Container>
        <h1 className="text-center">Form Leads</h1>
        <Row>
          <Col xs={12} md={9}>
            <DateRangePicker
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              onDatesChange={this.changeDates}
              focusedInput={this.state.focusedInput}
              onFocusChange={focusedInput => this.setState({ focusedInput })}
              isOutsideRange={() => false}
            />
          </Col>
          <Col xs={12} md={3}>
            <CSVLink data={items}
              filename={"my-file.csv"}
              className="btn btn-primary float-right"
              target="_blank">
                Export CSV
            </CSVLink>
          </Col>
        </Row>
        <FormLeads items={items} />
      </Container>
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
