import React from 'react'
import Link from 'next/link'

const PostPropertyPath = () => {
  return (
    <div className="container mb-5">
    <div className="footer-post">
      <div className="row align-items-center">
        <aside className="col-lg">
          <h3>Post Your Property For Free</h3>
          <p>Post your property easily and reach potential buyers quickly.</p>
        </aside>
        <aside className="col-lg-auto">
        <Link href="/postproperty" className="btn btn-primary">
            <i className="icon-line-awesome-mouse-pointer"></i> Post Property <img src="/assets/images/icons/free-badge.png" alt="Free Badge" height="32" width="32"/>
            </Link>
        </aside>
      </div>
    </div>
  </div>
  )
}

export default PostPropertyPath
