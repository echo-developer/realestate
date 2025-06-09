import useTranslation from '@/hooks/useTranslation'
import React from 'react'

const NoResultFound = ({type, handleClearFilters}) => {
    const translation = useTranslation();
    return (
        <div className='card not-found mb-4'>       
           <div className='card-body'>
                <img src='/assets/images/icons/inspection.png' alt='Icon' height={64} width={64} />     
                <h5>We couldn’t find any {type == 'property' ? 'properties' : 'projects'} matching your search.</h5>            
                <p>Try adjusting your filters or check back later.</p>
                <button className="btn btn-outline-primary mt-3" onClick={handleClearFilters}>
                    Clear Filters
                </button>
           </div>
        </div>
    )
}

export default NoResultFound
