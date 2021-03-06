import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as actions from '../../actions/matches.jsx';
import UploadImage from './upload_image.jsx';
import Review from './Reviews/reviews.jsx';
import SubmitReview from './Reviews/submit_review.jsx';
import { Rating } from 'material-ui-rating';
import { generateChatRoomName } from '../../config.jsx';


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editPhoto: false,
      review: false
    }
    this.addFriend = this.addFriend.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.toggleReview = this.toggleReview.bind(this);
    this.props.getTarget(this.props.user.Email, this.props.params.userEmail);
  }

  toggleEdit() {
    this.setState({
      editPhoto: !this.state.editPhoto
    });
  }

  toggleReview() {
    this.setState({
      review: !this.state.review
    });
  }

  addFriend(){
    this.props.handleMatch(this.props.target, "Friend", "/api/friends", this.props.user);
  }

  render() {
    if (this.props.target) {
      let ids = [this.props.user.ID, this.props.target.ID].sort();
      const isUser = this.props.user.Email === this.props.target.Email;
      const { Email, Image } = this.props.target;
      const ProfilePic = () => (
        <div>
          <img className="profileImage" src={Image} />
        </div>
      )
      return (
        <div className="background" style={{backgroundImage: "url(styles/tweed.png)"}}>
          <div className="ProfileContainer">
            <div className="Profile" style={{backgroundImage: "url(styles/creampaper.png)"}}>
              <div className="ProfilePicture">
                {
                  !this.state.editPhoto ? this.props.target.Image ? <ProfilePic /> : <img className="profileImage" src={"./styles/noprofile.png"} /> : null
                }
                {this.state.editPhoto && isUser ? <div className="profileImage"><UploadImage toggleEdit={this.toggleEdit} /></div> : null }
              </div>
              <div className="ProfileInfo">
                {!this.state.editPhoto ? isUser ? <button className="Button" onClick={this.toggleEdit}>Edit Profile Picture</button> : null : <button className="Button" onClick={this.toggleEdit}>Cancel</button> }
                <div className="ProfileRating">
                  <Rating value={this.props.target.Rating_Average} max={5} readOnly={true} onChange={() => console.log("nothing")} />
                </div>
                <div className="ProfileName">{this.props.target.Name}</div>
                <div className="ProfileContactInfo">
                  {this.props.target.Profession} @ {this.props.target.Company}  -  {this.props.target.City}  -  {this.props.target.Email}
                </div>
                <h2>Interests</h2>
                <div className="ProfileInterests">
                  { this.props.target ? this.props.target.Interests.split('-').map((interest,i) => <div className="profileInterest" key={i}>{interest}</div>) : null}
                </div>
                <div className="ProfileBio">{this.props.target.Bio}</div>
                {this.props.friend ? <a href={`/#/messenger`} className="Button">Message</a> : this.props.user.Email !== this.props.target.Email ? <button className="Button" onClick={this.addFriend} >Connect!</button> : null}
              </div>
            </div>         
            <div className="ProfileReview">
              <h2 style={{"marginTop": "50px", color: "white"}} >Reviews</h2>
              {this.props.friend ? <center>{!this.state.review ? <button className="Button" style={{ "color": "white" }} onClick={this.toggleReview} >Write A Review!</button> : <button className="Button" style={{ "color": "white" }} onClick={this.toggleReview} >Cancel!</button>}</center> : null }
              {this.state.review ? <SubmitReview type={"add"} rating={0} value={""} /> : null }
              <div className="Reviews">
                {this.props.target.Reviews ? this.props.target.Reviews.map((review, i) => <Review key={i} index={i} review={review} />) : null}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div>Loading.....</div>
    }
  }
};

function mapStateToProps(state) {
  return { 
    target: state.target.User, 
    user: state.userInfo.user,
    friend: state.target.IsFriend,
  }
}

export default connect(mapStateToProps, actions)(Profile);