import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';

const steps = [
  { id: 1, label: 'Personal Info' },
  { id: 2, label: 'Project Details' },
  { id: 3, label: 'Location' },
  { id: 4, label: 'Features' },
  { id: 5, label: 'Availability' },
  { id: 6, label: 'Photos' },
];

const tips = [
  {
    img: '/images/icons/17678554.png',
    title: 'Post your Project Ad',
    description:
      'This is some content from a media component. You can replace this with any content and adjust it as needed.',
  },
  {
    img: '/images/icons/13434917.png',
    title: 'Add Quality Photos',
    description:
      'This is some content from a media component. You can replace this with any content and adjust it as needed.',
  },
  {
    img: '/images/icons/9094158.png',
    title: 'Add Correct Locality/Address',
    description:
      'This is some content from a media component. You can replace this with any content and adjust it as needed.',
  },
  {
    img: '/images/icons/10209854.png',
    title: 'Write a Great Description',
    description:
      'This is some content from a media component. You can replace this with any content and adjust it as needed.',
  },
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <MainLayout>
      <div className="section post-page">
        <div className="container">
          <div className="row justify-content-center">
            {/* Main Content */}
            <aside className="col-lg-8 col-12">
              <div className="d-sm-flex justify-content-between mb-3">
                <h1 className="h3">Post Own Your Project</h1>
                <p>
                  You are posting this Project for{' '}
                  <b className="text-green h4">FREE!</b>
                </p>
              </div>
              <div className="card border-0 post-form">
                <div className="card-header pb-0">
                  <ul className="nav nav-underline mb-0 gap-5 d-flex">
                    {steps.map((step) => (
                      <li className="nav-item" key={step.id}>
                        <button
                          className={`nav-link ${currentStep === step.id ? 'active' : ''}`}
                          onClick={() => setCurrentStep(step.id)}
                          aria-current={currentStep === step.id ? 'step' : undefined}
                        >
                          {step.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-body">
                  <form>
                    {steps.map((step) =>
                      currentStep === step.id ? (
                        <h1 key={step.id}>{step.label} Content</h1>
                      ) : null
                    )}
                  </form>
                </div>
              </div>
            </aside>

            {/* Sidebar */}
            <aside className="col-lg-4 col-12">
              <div className="card border-0 shadow-1 mt-3 mt-lg-0">
                <div className="card-body">
                  <h3 className="mb-3">How To Find The Right Buyer?</h3>
                  <div className="ad-post-points">
                    {tips.map((tip, index) => (
                      <div className="d-flex mb-3" key={index}>
                        <div className="flex-shrink-0">
                          <img
                            src={tip.img}
                            alt="Icon"
                            height="48"
                            width="48"
                          />
                        </div>
                        <div className="flex-grow-1 ps-3">
                          <h4>{tip.title}</h4>
                          <p>{tip.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
