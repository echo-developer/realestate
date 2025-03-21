import React from 'react'
import Link from 'next/link'
import useTranslation from '../../hooks/useTranslation'


const PostPropertyPath = () => {
  const translation = useTranslation();

  return (
    <section className='section'>
      <div className="container">
        <div className="footer-post">
          <div className="row align-items-center">
            <aside className="col-lg mb-3 mb-lg-0">
              <h3> {translation?.post_your_property_for_free || "Post Your Property For Free"}</h3>
              <p>{translation?.post_your_property_description || "Post your property easily and reach potential buyers quickly."}</p>
            </aside>
            <aside className="col-lg-auto">
            <Link href="/postproperty" className="btn btn-primary">
                <i className="icon-line-awesome-mouse-pointer"></i>{translation?.post_property || "Post Property"}  <img src="/assets/images/icons/free-badge.png" alt="Free Badge" height="32" width="32"/>
                </Link>
            </aside>
          </div>
        </div>
      </div>
    </section>  
  )
}

export default PostPropertyPath
