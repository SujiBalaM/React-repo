import React, { Fragment, Component } from 'react';
import './App.css';
import Navbar from './Components/Layout/navbar';
import Users from './Components/Layout/users/Users';
import User from './Components/Layout/users/User';
import Search from './Components/Layout/users/Search';
import axios from 'axios';
import { Alert } from './Components/Layout/Alert';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import About from './Components/Pages/About';
class App extends Component {
  state = {
    users: [],
    user: {},
    loading: false,
    alert: null,
    repos: []
  };
  searchUsers = async text => {
    this.setState({ loading: true });
    const searchUsers = await axios.get(
      `https://api.github.com/search/users?q=${text}`
    );
    this.setState({ users: searchUsers.data.items, loading: false });
  };
  clearUsers = () => {
    this.setState({ users: [], loading: false });
  };
  getUser = async username => {
    this.setState({ loading: true });
    const getUser = await axios.get(`https://api.github.com/users/${username}`);
    this.setState({ user: getUser.data, loading: false });
  };
  getUserRepos = async username => {
    this.setState({ loading: true });
    const getUserRepos = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc`
    );
    this.setState({ repos: getUserRepos.data, loading: false });
  };
  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });
  };
  // async componentDidMount() {
  //   this.setState({ loading: true });
  //   const getUsers = await axios.get('https://api.github.com/users');
  //   this.setState({ users: getUsers.data, loading: false });
  // }

  render() {
    return (
      <Router>
        <div className='App'>
          <Navbar />
          <div className='container'>
            <Alert alert={this.state.alert} />
            <Switch>
              <Route
                exact
                path='/'
                render={props => (
                  <Fragment>
                    <Search
                      searchUsers={this.searchUsers}
                      clearUsers={this.clearUsers}
                      showClear={this.state.users.length > 0 ? true : false}
                      setAlert={this.setAlert}
                    />
                    <Users
                      loading={this.state.loading}
                      users={this.state.users}
                    />
                  </Fragment>
                )}
              ></Route>
              <Route path='/about' component={About} />
              <Route
                exact
                path='/user/:login'
                render={props => (
                  <User
                    {...props}
                    getUser={this.getUser}
                    getUserRepos={this.getUserRepos}
                    user={this.state.user}
                    repos={this.state.repos}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
