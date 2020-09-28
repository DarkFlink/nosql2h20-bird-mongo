import React from "react";
import { connect } from 'react-redux';
import {Button, Card, Form} from 'react-bootstrap';
import style from './Post.module.scss'
import AuthorPlate from "./AuthorPlate/AuthorPlate";
import Comments from "./Comments/Comments";
import NewPost from "../NewPost/NewPost";
import ImageUploader from "../ImageUploader/ImageUploader";
import {editPost} from "../../redux/feed/feed";

class Post extends React.PureComponent{

  state={
    isEditMode: false,
    image: null,
  };

  setImage = file => this.setState({ image: file })

  editPostMode = () => this.setState(prevState => ({
    isEditMode: !prevState.isEditMode
  }))

  savePost = () => {
    const { editPost, data } = this.props;
    const { image } = this.state;

    const form = new FormData();
    if (image) {
      form.set('image', image);
    }
    form.set('text', this.text.value);

    editPost(data._id, form, () => {
      this.setState({
        isEditMode: false,
        image: null,
      });
    });
  }

  render() {
    const { data } = this.props;
    const { isEditMode, image } = this.state;
    return(
      <Card className={style.post}>
        <Card.Body>
          <AuthorPlate
            editPost={this.editPostMode}
            createdAt={data.createdAt}
            author={data.author}
            postId={data._id}
            isEditMode={isEditMode}
          />
          <Card.Text>
            {
              isEditMode ?
                <Form.Control
                  style={{ resize: 'none' }}
                  placeholder={'Enter text'}
                  as="textarea" rows={3}
                  maxLength={512}
                  ref={(ref) => { this.text = ref }}
                  defaultValue={data.text}
                />
                :
                data.text
            }
          </Card.Text>
          {
            isEditMode ?
              <ImageUploader
                uniqueString={data._id}
                setImage={this.setImage}
                imageFile={image}
                preViewImage={data.image}
              />
              :
              <Card.Img src={data.image} />
          }
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {
              isEditMode &&
              <div style={{ marginTop: '1rem' }}>
                <Button
                  style={{ marginLeft: '1rem' }}
                  className="float-right"
                  variant="primary"
                  type="submit"
                  onClick={this.savePost}
                >
                  Save
                </Button>
                <Button
                  onClick={this.editPostMode}
                  className="float-right"
                  variant="link-secondary"
                  type="submit"
                >
                  Cancel
                </Button>
              </div>
            }
            <Comments postId={ data._id }/>
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export default connect(state => ({

}), {
  editPost
})(Post)