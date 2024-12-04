import React from 'react'

const PostPropertyPath = () => {
  return (
    <div className="container mb-5">
    <div className="footer-post">
      <div className="row align-items-center">
        <aside className="col-lg">
          <h3>Post Your Property For Free</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </aside>
        <aside className="col-lg-auto">
        <a href="post.php" className="btn btn-primary">
            <i className="icon-line-awesome-mouse-pointer"></i> Post Property <img src="assets/images/icons/free-badge.png" alt="Free Badge" height="32" width="32"/>
            </a>
        </aside>
      </div>
    </div>
  </div>
  )
}

export default PostPropertyPath
