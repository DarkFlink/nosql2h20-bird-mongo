import React from "react";
import style from "../NewPost/NewPost.module.scss";
import {Card} from "react-bootstrap";

export default class ImageUploader extends React.PureComponent{

  state={
    preViewImage: this.props.preViewImage,
    isFileDragOver: false
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.imageFile !== this.props.imageFile) {
      if (this.props.imageFile) {
        this.loadPreviewImage();
      } else {
        this.setState({
          preViewImage: null,
          isFileDragOver: false
        });
      }
    }
  }

  onDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ isFileDragOver: true })
  };

  onDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ isFileDragOver: false })
  };

  onFileDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setFileDrag(e.dataTransfer.files[0]);
    this.setState({ isFileDragOver: false })
  }

  loadPreviewImage = () => {
    const { imageFile } = this.props;
    const reader = new FileReader();

    reader.onload = () => {
      this.setState({
        preViewImage: reader.result
      })
    }

    reader.readAsDataURL(imageFile);
  }

  onFileUpload = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setFileDrag(e.target.files[0]);
    this.setState({ isFileDragOver: false }, this.loadPreviewImage)
  }

  setFileDrag = file => this.props.setImage(file);

  render() {
    const { preViewImage, isFileDragOver } = this.state
    const { uniqueString } = this.props
    return(
      <>
        <input
          style={{ display: 'none' }}
          type="file"
          id={`fileElem${uniqueString}`}
          accept="image/x-png,image/gif,image/jpeg"
          onChange={this.onFileUpload}
        />
        <label
          htmlFor={`fileElem${uniqueString}`}
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragLeave}
          onDrop={this.onFileDrop}
          style={{ width: '100%', cursor: 'pointer' }}
        >
          {
            preViewImage ?
              <div className={style.imageCard}>
                <Card.Img src={preViewImage} />
                <div
                  className={`${style.replaceImage} ${ isFileDragOver ? style.replaceImageActive : ''}`}
                >
                  Replace picture
                </div>
              </div>
              :
              <div
                className={style.addPicture}
                style={{
                  borderColor: isFileDragOver ? '#007bff' : 'rgba(0,0,0,.3)',
                  color: isFileDragOver ? '#007bff' : 'rgba(0,0,0,.3)'
                }}
              >
                Add picture
              </div>
          }
        </label>
      </>
    );
  }
}