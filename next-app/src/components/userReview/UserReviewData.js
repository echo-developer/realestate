import { useState } from 'react';
import styles from './reviewdata.css';

const UserReviewData = () => {
  const [neighborhoodRate, setNeighborhoodRate] = useState('');
  const [roadsRate, setRoadsRate] = useState('');
  const [safetyRate, setSafetyRate] = useState('');
  const [cleanlinessRate, setCleanlinessRate] = useState('');
  const [publicTransportRate, setPublicTransportRate] = useState('');
  const [parkingRate, setParkingRate] = useState('');
  const [connectivityRate, setConnectivityRate] = useState('');
  const [trafficRate, setTrafficRate] = useState('');
  const [marketRate, setMarketRate] = useState('');
  const [schoolsRate, setSchoolsRate] = useState('');
  const [restaurantsRate, setRestaurantsRate] = useState('');
  const [hospitalRate, setHospitalRate] = useState('');
  const [userRelation, setUserRelation] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewDescription, setReviewDescription] = useState('');
  const [errors, setErrors] = useState({});
  

  const handleRatingChange = (e, setter) => {
    setter(e.target.value);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!userRelation) formErrors.userRelationError = 'Please select your relation to the property.';
    if (!reviewTitle) formErrors.reviewTitleError = 'Please add a title.';
    if (!reviewDescription) formErrors.reviewDescriptionError = 'Please write a review.';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const reviewData = {
        neighborhoodRate,
        roadsRate,
        safetyRate,
        cleanlinessRate,
        publicTransportRate,
        parkingRate,
        connectivityRate,
        trafficRate,
        marketRate,
        schoolsRate,
        restaurantsRate,
        hospitalRate,
        userRelation,
        reviewTitle,
        reviewDescription,
      };
      console.log(reviewData);

      // Example for handling server-side requests
      const response = await fetch('/api/submitReview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        console.log('Review submitted successfully!');
        // Reset form or show success message
      } else {
        console.error('Failed to submit review');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.back} onClick={() => { /* Add your hide function here */ }}></div>
        <div className={styles.title}>Write your review</div>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.subheading}>Add Rating</div>
        <div className={styles.ratingWrap}>
          {/* Rating fields */}
          <div className={styles.ratingBox}>
            <div className={styles.ratingLabel}>Neighborhood</div>
            {[5, 4, 3, 2, 1].map((value) => (
              <label key={value} className={styles.starGroup}>
                <input
                  type="radio"
                  name="neighborhood_rate"
                  value={value}
                  onChange={(e) => handleRatingChange(e, setNeighborhoodRate)}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
          {/* Add other rating fields similar to Neighborhood */}
        </div>

        <div className={styles.subheading}>Tell us more about your review</div>
        <div>
          <label>
            <input
              type="radio"
              name="user_relation"
              value="Owner"
              onChange={(e) => setUserRelation(e.target.value)}
            />
            Owner
          </label>
          <label>
            <input
              type="radio"
              name="user_relation"
              value="Tenant"
              onChange={(e) => setUserRelation(e.target.value)}
            />
            Tenant
          </label>
          {errors.userRelationError && <div className={styles.error}>{errors.userRelationError}</div>}
        </div>
        <div>
          <input
            type="text"
            name="review_title"
            placeholder="Review Title"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
          />
          {errors.reviewTitleError && <div className={styles.error}>{errors.reviewTitleError}</div>}
        </div>
        <div>
          <textarea
            name="review_description"
            placeholder="Write your review"
            value={reviewDescription}
            onChange={(e) => setReviewDescription(e.target.value)}
          ></textarea>
          {errors.reviewDescriptionError && <div className={styles.error}>{errors.reviewDescriptionError}</div>}
        </div>
        <button type="submit" className={styles.submitButton}>
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default UserReviewData;
