import React from 'react'
import { Link } from 'react-router-dom'

function ErrorPage() {
    return (
        <div className='error_wrapper'>
            <h2>4<span className='text-blue'>0</span>4</h2>
            <h3>Ooops, Page Not Found</h3>
            <p className='text-center'>We're Sorry, The Page you requested could not be found. <br/>Please Go Back to The Home Page.</p>
            <Link to={'/'} className='btn-theme' >Go Back To Home</Link>
        </div>
    )
}

export default ErrorPage
