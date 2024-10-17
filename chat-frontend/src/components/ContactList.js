import React from 'react';

const ContactList = ({ users, currentUser, onSelect }) => {
  return (
    <div className="contact-list">
      <h2>Chat with other users</h2>
      {users.filter(user => user._id !== currentUser.userId).map((contact) => (
        <div
          key={contact._id}
          className="contact"
          onClick={() => onSelect(contact)}
        >
          {contact.username}
        </div>
      ))}
    </div>
  );
};

export default ContactList;