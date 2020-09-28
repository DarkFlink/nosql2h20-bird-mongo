import React from "react";
import styles from './AuthorPlate.module.scss'
import moment from 'moment';
import deleteIcon from '../../../images/delete.svg';
import { connect } from 'react-redux';
import { deletePost } from "../../../redux/feed/feed";
import {userSelector} from "../../../redux/auth/auth";
import defaultUserAvatar from '../../../images/user.png';
import editIcon from '../../../images/edit.svg';
import { withRouter } from 'react-router';

class AuthorPlate extends React.PureComponent{

  toProfile = () => {
    const { history, author: { _id }, } = this.props;
    history.push(`/users/${_id}`);
  };

  render() {
    const {
      author: { _id, login, image},
      createdAt,
      deletePost,
      postId,
      user,
      editPost,
      isEditMode
    } = this.props;
    return (
      <div className={styles.container}>
        <img onClick={this.toProfile} alt={'avatar'} className={styles.avatar} src={image || defaultUserAvatar} />
        <div onClick={this.toProfile} className={styles.info}>
          <div>
            <div className={styles.login}>{login}</div>
            <div className={styles.date}>{moment(createdAt).format('DD MMMM, HH:mm')}</div>
          </div>
        </div>
        {
          !isEditMode &&
          (_id === user._id) &&
          <img onClick={editPost} className={styles.icon} alt={'edit'} src={editIcon} />
        }
        {
          (_id === user._id) &&
          <img onClick={() => deletePost(postId)} className={styles.icon} alt={'delete'} src={deleteIcon} />
        }
      </div>
    );
  }
}

export default withRouter(connect(state => ({
  user: userSelector(state)
}), {
  deletePost
})(AuthorPlate));