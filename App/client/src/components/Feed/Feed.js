import React from "react";
import { connect } from 'react-redux';
import {feedSelector, isLoadingFeedSelector, loadFeed} from "../../redux/feed/feed";
import {Button, Form, FormControl, InputGroup, Spinner} from 'react-bootstrap';
import styles from './Feed.module.scss';
import Post from "../Post/Post";
import NewPost from "../NewPost/NewPost";
import {userSelector} from "../../redux/auth/auth";

class Feed extends React.PureComponent{

  state={
  }

  componentDidMount() {
    const { loadFeed } = this.props;
    const { authorId = null } = this.props;
    loadFeed(true, { authorId });
  }

  search = e => {
    e.preventDefault();
    const { authorId = null, loadFeed } = this.props;
    loadFeed(true, { authorId, search: this.searchText.value });
  }

  render() {
    const { feed, isLoading, authorId = null, user } = this.props;
    return(
      <div className={styles.container}>
        {
          (!authorId || (authorId === user._id)) &&
          <NewPost/>
        }
        <Form className={styles.search} onSubmit={this.search}>
          <InputGroup>
            <FormControl
              placeholder="Search posts"
              ref={(ref) => { this.searchText = ref }}
            />
            <InputGroup.Append>
              <Button type={'submit'} variant="outline-secondary">Search</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
        {
          isLoading ?
            <Spinner animation="border" variant="primary" />
            :
            feed.map(post => <Post key={post._id} data={post} />)
        }
      </div>
    );
  }
}

export default connect(state => ({
  user: userSelector(state),
  feed: feedSelector(state),
  isLoading: isLoadingFeedSelector(state)
}), {
  loadFeed
})(Feed)
