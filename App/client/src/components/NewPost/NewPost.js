import React from "react";
import { connect } from 'react-redux';
import style from "./NewPost.module.scss";
import {Button, Card, Form} from "react-bootstrap";
import {message} from "antd";
import {createPost} from "../../redux/feed/feed";
import ImageUploader from "../ImageUploader/ImageUploader";

class NewPost extends React.PureComponent{

  state={
    image: null
  };

  submitPost = () => {
    const { image } = this.state;
    const { createPost } = this.props;
    if (!this.text.value) {
      return message.error('Text can not be empty')
    }
    if (!image) {
      return message.error('Picture can not be empty')
    }
    const form = new FormData();
    form.set('image', image);
    form.set('text', this.text.value);

    createPost(form, () => {
      this.text.value = '';
      this.setState({
        image: null,
        preViewImage: null,
      })
    });
  };

  setImage = file => this.setState({
    image: file
  });

  render() {
    const { image } = this.state;
    return (
      <Card className={style.post}>
        <Card.Body>
          <Card.Text>
            <Form.Control
              style={{ resize: 'none' }}
              placeholder={'Enter text'}
              as="textarea" rows={3}
              maxLength={512}
              ref={(ref) => { this.text = ref }}
            />
          </Card.Text>
          <ImageUploader uniqueString={'newPost'} setImage={this.setImage} imageFile={image}  />
          <Button onClick={this.submitPost} style={{ width: '6rem' }} className="float-right">Post</Button>
        </Card.Body>
      </Card>
    );
  }
}

export default connect(state => ({

}), {
  createPost
})(NewPost)