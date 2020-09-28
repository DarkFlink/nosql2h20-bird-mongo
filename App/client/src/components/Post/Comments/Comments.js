import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import {userSelector} from "../../../redux/auth/auth";
import {InputGroup, FormControl, Button, Form} from 'react-bootstrap';
import defaultUserAvatar from '../../../images/user.png';
import deleteIcon from '../../../images/delete.svg';
import styles from './Comments.module.scss';
import axios from 'axios';
import moment from 'moment';
import {loadAchievements} from "../../../redux/achievements/achievements";
import {profileSelector} from "../../../redux/users/users";

class Comments extends React.PureComponent{

  state = {
    commentsCount: 0,
    comments: [],
    commentsHidden: true
  };

  componentDidMount() {
    this.getComments(1);
  }

  getComments = (limit = null) => {
    const { postId } = this.props;
    axios.get(`/posts/${postId}/comments/`, { params: { limit } }).then(response => {
      this.setState({
        comments: response.data.comments,
        commentsCount: response.data.count,
        commentsHidden: !!limit
      })
    })
  };

  showAllComments = () => {
    this.setState({
      commentsHidden: false
    }, this.getComments)
  };

  sendComment = e => {
    e.preventDefault();
    e.stopPropagation();
    if (this.comment.value && this.comment.value.length < 512) {
      const { postId, loadAchievements, profile: { _id } } = this.props;
      axios.post(`/posts/${postId}/comments/`, { text: this.comment.value }).then(response => {
        loadAchievements(_id, false);
        this.comment.value = '';
        this.setState({
          comments: response.data.comments,
          commentsCount: response.data.commentsCount,
          commentsHidden: false
        });
      });
    }
  };

  deleteComment = id => {
    const { postId } = this.props;
    axios.delete(`/posts/${postId}/comments/${id}/`).then(response => {
      this.setState({
        comments: response.data.comments,
        commentsCount: response.data.commentsCount,
        commentsHidden: false
      });
    });
  };

  toProfile = id => {
    const { history } = this.props;
    history.push(`/users/${id}`);
  };

  render() {
    const { user } = this.props;
    const { comments, commentsCount, commentsHidden } = this.state;

    return(
      <div className={styles.container}>
        <div className={styles.author}>
          <img className={styles.avatar} alt={'avatar'} src={user.image || defaultUserAvatar}/>
          <Form style={{flexGrow: '2'}} onSubmit={this.sendComment}>
            <InputGroup>
              <FormControl
                placeholder="Enter comment"
                ref={(ref) => { this.comment = ref }}
              />
              <InputGroup.Append>
                <Button type={'submit'} variant="outline-secondary">Send</Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
        </div>
        <div className={styles.commentsList}>
          {
            comments.map(comment =>
              <div key={comment._id} className={styles.commentPlate}>
                <img
                  onClick={() => this.toProfile(comment.author._id)}
                  alt={'avatar'}
                  className={styles.avatar}
                  src={comment.author.image || defaultUserAvatar}
                />
                <div className={styles.commentPlateBody}>
                  <div className={styles.commentAuthor}>
                    <b
                      onClick={() => this.toProfile(comment.author._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {comment.author.login}
                    </b>
                    {
                      comment.author._id === user._id &&
                      <img onClick={() => this.deleteComment(comment._id)} alt={'delete'} src={deleteIcon} />
                    }
                  </div>
                  <div>{comment.text}</div>
                  <div className={styles.commentTime}>
                    {moment(comment.createdAt).format('DD MMMM, HH:mm')}
                  </div>
                </div>
              </div>
            )
          }
          {
            commentsHidden && (commentsCount > comments.length) &&
            <div onClick={this.showAllComments} className={styles.showAllButton}>
              Show all comments ({commentsCount})
            </div>
          }
        </div>
      </div>
    )
  }
}

export default withRouter(connect(state => ({
  user: userSelector(state),
  profile: profileSelector(state)
}), {
  loadAchievements
})(Comments));