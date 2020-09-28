import React from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {Card, Button, Spinner, Form} from 'react-bootstrap';
import {
  isLoadingProfileSelector,
  profileSelector,
  loadProfile,
  editProfile
} from "../../redux/users/users";
import styles from './UserPage.module.scss';
import defaultUserAvatar from '../../images/user.png';
import {userSelector} from "../../redux/auth/auth";
import ImageUploader from "../ImageUploader/ImageUploader";
import {message} from "antd";
import Feed from "../Feed/Feed";
import Achievements from "./Achievements/Achievements";

class UserPage extends React.PureComponent{

  state={
    image: null
  }

  componentDidMount() {
    const { match: { params: { userId } }, loadProfile } = this.props;
    loadProfile(userId);
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { userId } }, loadProfile } = this.props;
    if (prevProps.match.params.userId !== userId) {
      loadProfile(userId);
    }
  }

  setImage = file => this.setState({
    image: file
  });

  saveProfile = () => {
    const { editProfile, user: { _id } } = this.props;
    const { image } = this.state;

    const form = new FormData();
    if (image) {
      form.set('image', image);
    }
    form.set('description', this.description.value);
    editProfile(_id, form, () => message.success('Saved'));
  };

  render() {
    const { profile, isLoading, user } = this.props;
    const { image } = this.state;

    const isEditMode = user._id === profile._id;
    return(
      <div className={styles.container}>
        {
          isLoading ?
            <Spinner style={{ marginTop: '2rem' }} animation="border" variant="primary" />
            :
            <div className={styles.content}>
              <Card className={styles.userCard}>
                {
                  isEditMode ?
                    <ImageUploader
                      uniqueString={profile._id}
                      setImage={this.setImage}
                      imageFile={image}
                      preViewImage={profile.image || defaultUserAvatar}
                    />
                  :
                    <Card.Img variant="top" src={profile.image || defaultUserAvatar} />
                }
                <Card.Body style={{ paddingTop: '0.5rem' }}>
                  <Card.Title>{profile.login}</Card.Title>
                  <Card.Text style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                    {
                      isEditMode ?
                        <Form.Control
                          style={{ resize: 'none' }}
                          placeholder={'Enter description'}
                          as="textarea" rows={2}
                          maxLength={256}
                          ref={(ref) => { this.description = ref }}
                          defaultValue={profile.description}
                        />
                        :
                        profile.description
                    }
                  </Card.Text>
                  {
                    isEditMode &&
                    <Button onClick={this.saveProfile} className="float-right" variant="primary">Save</Button>
                  }
                </Card.Body>
              </Card>
              <div>
                <Achievements id={profile._id}/>
                <div style={{ marginTop: '1rem' }}>
                  <Feed authorId={profile._id}/>
                </div>
              </div>
            </div>
        }
      </div>
    );
  }
}

export default withRouter(connect(state => ({
  user: userSelector(state),
  profile: profileSelector(state),
  isLoading: isLoadingProfileSelector(state)
}), {
  loadProfile,
  editProfile
})(UserPage));