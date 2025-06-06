import useTranslation from '@/hooks/useTranslation'
import React from 'react'

const NoResultFound = ({type, handleClearFilters}) => {
    const translation = useTranslation();
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
                textAlign: "center",
                fontSize: "28px",
                fontWeight: "bold",
                color: "#555",
            }}
        >
            <p className="text-muted">
                We couldn’t find any {type == 'property' ? 'properties' : 'projects'} matching your search.
                <br />
                Try adjusting your filters or check back later.
            </p>
            <button className="btn btn-outline-primary mt-3" onClick={handleClearFilters}>
                Clear Filters
            </button>
        </div>
    )
}

export default NoResultFound
