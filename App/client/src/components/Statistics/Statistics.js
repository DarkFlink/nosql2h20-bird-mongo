import React from 'react';
import moment from "moment";
import styles from './Statistics.module.scss';
import axios from 'axios';
import { DatePicker } from 'antd';
import { AutoComplete } from 'antd';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {Button, Spinner, Table} from "react-bootstrap";

const { RangePicker } = DatePicker;

export default class Statistics extends React.PureComponent {

  state = {
    statistics: {},
    startDate: null,
    endDate: null,
    search: '',
    isLoading: true,
    author: null
  };

  componentDidMount() {
    this.getUsers();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      (prevState.startDate !== this.state.startDate) ||
      (prevState.endDate !== this.state.endDate) ||
      (prevState.author !== this.state.author) ||
      (prevState.search !== this.state.search)
    ) {
      this.getUsers(false);
    }
  }

  getUsers = (setLoading = true) => {
    const { startDate, endDate, search, author } = this.state;
    setLoading && this.setState({
      isLoading: true
    });
    axios.get(`/admin/statistics/`, { params: {
        startDate: startDate ? moment(startDate).toDate() : null,
        endDate: endDate ? moment(endDate).toDate() : null,
        search,
        author: author?._id
      } })
      .then(response => {
        this.setState({
          statistics: response.data,
          isLoading: false
        });
      });
  };

  reset = () => {
    this.setState({
      startDate: null,
      endDate: null,
      search: '',
      author: null
    });
  };

  datesHandler = (dates, dateStrings) => {
    this.setState({
      startDate: dates[0],
      endDate: dates[1]
    });
  }

  searchHandler = val => this.setState({ search: val, author: null });

  setAuthorHandler = author => this.setState({ author });

  render() {
    const { startDate, endDate, statistics, search, isLoading, author } = this.state;

    const data = [
      {
        name: (startDate && endDate) ?
          `${author ? `${author.login}: ` : ''}${moment(startDate).format('DD.MM.YYYY')} - ${moment(endDate).format('DD.MM.YYYY')}`
          :
          `${author ? `${author.login}: ` : ''}All periods`,
        posts: statistics.postsCount,
        comments: statistics.commentsCount,
      },
    ];

    const options = statistics.users?.map(user => ({ value: user.login })) || [];

    return(
      isLoading
      ?
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
        :
        <div className={styles.container}>
          <div className={styles.title}>
            Statistics
          </div>
          <div className={styles.filters}>
            <RangePicker
              value={[startDate, endDate]}
              style={{ width: '16rem' }}
              onChange={this.datesHandler}
            />
            <AutoComplete
              style={{ width: '10rem' }}
              options={options}
              placeholder="user's login"
              value={search}
              onChange={this.searchHandler}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            />
            <Button variant="secondary" size="sm" onClick={this.reset}>Reset</Button>
          </div>
          <Table style={{ marginBottom: '1rem', cursor: 'pointer' }} hover striped bordered size="sm">
            <thead>
            <tr>
              <th>#</th>
              <th>Login</th>
              <th>Account type</th>
            </tr>
            </thead>
            <tbody>
            {
              statistics.users.map(
                (user, index) =>
                  <tr onClick={() => this.setAuthorHandler(user)}>
                    <td>{index + 1}</td>
                    <td style={{ width: '60%' }}>{user.login}</td>
                    <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                  </tr>
              )
            }
            </tbody>
          </Table>
          <div style={{ marginLeft: '-30px' }}>
            <BarChart
              width={500}
              height={300}
              data={data}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="posts" fill="#8884d8" />
              <Bar dataKey="comments" fill="#82ca9d" />
            </BarChart>
          </div>
        </div>
    );
  }
}