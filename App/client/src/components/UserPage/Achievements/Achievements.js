import React from "react";
import {Card, Spinner, OverlayTrigger, Tooltip} from 'react-bootstrap';
import comment1 from '../../../images/1-comment.png';
import comment3 from '../../../images/3-comment.png';
import comment5 from '../../../images/5-comment.png';
import post1 from '../../../images/1-post.png';
import post3 from '../../../images/3-post.png';
import post5 from '../../../images/5-post.png';
import avatar from '../../../images/avatar.png';
import styles from "./Achievements.module.scss";
import { connect } from 'react-redux';
import {
  achievementsSelector,
  isLoadingAchievementsSelector,
  loadAchievements
} from "../../../redux/achievements/achievements";

class Achievements extends React.PureComponent{

  state={

  }

  componentDidMount() {
    const { id, loadAchievements } = this.props;
    loadAchievements(id);
  }

  achievementPlate = (name, img, completed) =>
    <div key={name}>
      <OverlayTrigger
        placement={'top'}
        overlay={
          <Tooltip id={`tooltip-top`}>
            {name}
          </Tooltip>
        }
      >
        <img
          className={`${styles.achievementIcon} ${completed ? '' : styles.achievementDisabled}`}
          alt={name}
          src={img}
        />
      </OverlayTrigger>
    </div>

  renderAchievement = achievement => {
    switch (achievement.codeName) {
      case "AVATAR_ACHIEVEMENT":
        return this.achievementPlate('Set yor profile pic', avatar, achievement.completed);
      case "CREATED_POST_1":
        return this.achievementPlate('Create one post', post1, achievement.completed);
      case "CREATED_POST_3":
        return this.achievementPlate('Create three posts', post3, achievement.completed);
      case "CREATED_POST_5":
        return this.achievementPlate('Create five posts', post5, achievement.completed);
      case "LEFT_COMMENT_1":
        return this.achievementPlate('Leave one comment', comment1, achievement.completed);
      case "LEFT_COMMENT_3":
        return this.achievementPlate('Leave three comments', comment3, achievement.completed);
      case "LEFT_COMMENT_5":
        return this.achievementPlate('Leave five comments', comment5, achievement.completed);
      default:
          return this.achievementPlate('Set avatar', avatar, achievement.completed);
    }
  };

  render() {
    const { isLoading, achievements } = this.props;
    return(
      <Card className={styles.container}>
        <Card.Body>
          <Card.Title>Achievements</Card.Title>
          {
            isLoading ?
              <div
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
              >
                <Spinner animation="border" variant="primary" />
              </div>
              :
              <div className={styles.achievementsRow}>
                {
                  achievements
                    .sort((a, b) => b.completed - a.completed)
                    .map(achievement => this.renderAchievement(achievement))
                }
              </div>
          }
        </Card.Body>
      </Card>
    );
  }
}

export default connect(state => ({
  achievements: achievementsSelector(state),
  isLoading: isLoadingAchievementsSelector(state)
}), {
  loadAchievements
})(Achievements)