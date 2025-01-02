import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const messagesData = [
  {
    id: 1,
    sender: "Selma Haq",
    time: "4 hours ago",
    message: "Excepteur sint occaecat cupidatat non proident",
    avatar: "assets/images/agents/agent-3.jpg",
    status: "status-online",
  },
  {
    id: 2,
    sender: "Farooq Basir",
    time: "Yesterday",
    message: "Duis aute irure voluptate velit cillum dolore fugiat nulla pariatur",
    avatar: "assets/images/agents/agent-1.jpg",
    status: "status-offline",
    active: true, 
  },
  {
    id: 3,
    sender: "Ahmed Tijani",
    time: "2 days ago",
    message: "Utenim ad minim veniam nostrud ullamco laboris nisi aliquip.",
    avatar: "assets/images/agents/agent-4.jpg",
    status: "status-offline",
  },
  {
    id: 4,
    sender: "Aisha Rahman",
    time: "2 days ago",
    message: "Yes, I received payment. Thanks for cooperation!",
    avatar: "assets/images/agents/agent-5.jpg",
    status: "status-online",
  },
  {
    id: 5,
    sender: "Jamal Razzaq",
    time: "2 days ago",
    message: "Yes, I received payment. Thanks for cooperation!",
    avatar: "assets/images/agents/agent-6.jpg",
    status: "status-online",
  },
];

const messageDetails = [
  {
    id: "message-1",
    time: "22 April, 2022",
    senderAvatar: "assets/images/user.jpg",
    senderName: "User",
    text: "labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam",
  },
  {
    id: "message-2",
    time: "Yesterday",
    senderAvatar: "assets/images/agents/agent-1.jpg",
    senderName: "Farooq Basir",
    text: "sunt in culpa qui officia deserunt mollit anim id est laborum",
  },
  {
    id: "message-3",
    time: "Yesterday",
    senderAvatar: "assets/images/user.jpg",
    senderName: "User",
    text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem",
  },
  {
    id: "message-4",
    time: "Yesterday",
    senderAvatar: "assets/images/agents/agent-1.jpg",
    senderName: "Farooq Basir",
    text: "accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae",
  },
  {
    id: "message-5",
    time: "Yesterday",
    senderAvatar: "assets/images/user.jpg",
    senderName: "User",
    text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit",
  },
  {
    id: "message-6",
    time: "Yesterday",
    senderAvatar: "assets/images/agents/agent-1.jpg",
    senderName: "Farooq Basir",
    text: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

const MessagesSection = () => {
  const [activeMessage, setActiveMessage] = useState(2);

  return (
    <DashboardLayout>
    <aside className="col-lg col-12">
      <div className="p-4">
        <div className="messages-container margin-top-0">
          <div className="messages-container-inner">
            {/* Messages Inbox */}
            <div className="messages-inbox">
              <div className="messages-headline">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="material-icons-outlined">search</i>
                  </span>
                  <input type="text" className="form-control" placeholder="Search" />
                </div>
              </div>
              <ul>
                {messagesData.map((message) => (
                  <li
                    key={message.id}
                    className={message.active ? "active-message" : ""}
                    onClick={() => setActiveMessage(message.id)}
                  >
                    <a href="#">
                      <div className="message-avatar">
                        <i className={`status-icon ${message.status}`}></i>
                        <img src={message.avatar} alt={message.sender} />
                      </div>
                      <div className="message-by">
                        <div className="message-by-headline">
                          <h5>{message.sender}</h5>
                          <span>{message.time}</span>
                        </div>
                        <p>{message.message}</p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Message Content */}
            <div className="message-content">
              <div className="messages-headline p-3">
                <h4>
                  <a
                    href="javascript:void(0)"
                    className="back-message me-3 d-lg-none"
                  >
                    <i className="icon-line-awesome-angle-left"></i>
                  </a>
                  {messagesData.find((msg) => msg.id === activeMessage)?.sender}
                </h4>
              </div>

              {/* Message Content Inner */}
              <div className="message-content-inner">
                {messageDetails.map((message) => (
                  <div key={message.id}>
                    <div className="message-time-sign">
                      <span>{message.time}</span>
                    </div>
                    <div
                      className={`message-bubble ${
                        message.senderName === "User" ? "me" : ""
                      }`}
                    >
                      <div className="message-bubble-inner">
                        <div className="message-avatar">
                          <img src={message.senderAvatar} alt={message.senderName} />
                        </div>
                        <div className="message-text">
                          <p>{message.text}</p>
                        </div>
                      </div>
                      <div className="clearfix"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Area */}
              <div className="message-reply">
                <textarea
                  cols="1"
                  rows="1"
                  className="form-control"
                  placeholder="Your Message"
                  data-autoresize=""
                ></textarea>
                <div className="uploadButton">
                  <input
                    type="file"
                    id="upload"
                    multiple="multiple"
                    className="uploadButton-input"
                  />
                  <label
                    htmlFor="upload"
                    className="uploadButton-button ripple-effect"
                  >
                    <i className="icon-feather-paperclip"></i>
                  </label>
                </div>
                <button className="button btn btn-primary">Send</button>
              </div>
            </div>
            {/* Message Content */}
          </div>
        </div>
      </div>
    </aside>
    </DashboardLayout>
  );
};

export default MessagesSection;
