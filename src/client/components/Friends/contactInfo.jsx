import React from 'react';
import { generateChatRoomName } from '../../config.jsx';

const ContactInfo = (props) => {
  let ids = [props.user.ID, props.person.ID].sort();
  return (
    <div className="contactContainer">
      <div className="contactBio">
        { `${(props.person.Bio).substring(0, 300)}...` }     
      </div>
      <div className="contactInterests">
        {props.person.Interests.split('-').map((interest, i) =>
          <div className="profileInterest" key={i}>{interest}</div>
        )}
      </div>
      <div className="contactButtons">
        <a style={{ margin: "0 20px" }} href={`/#/messenger`} className="Button">Message</a>
        <a style={{ margin: "0 20px" }} href={`/#/profile/${props.person.Email}`} className="Button">Profile</a>
        <button className="Button" style={{color: "red", border: "2px solid red"}} onClick={props.deleteFriend}>Remove Friend</button>
      </div>
    </div>
  )
}

export default ContactInfo;