'use client'

import {useState} from 'react'

const BookEvent=()=>{
    const [email,setEmail]=useState('');
    const [submitted, setSubmitted]=useState(false);
    const handleSubmit=(e:React.FormEvent)=>{ //only allows valid event actions like e.preventdefaut etc
        e.preventDefault()

        setTimeout(()=>{
            setSubmitted(true);
        },1000)
    }
    return(
        <div id="book-event">BookEvent
            {submitted?(
                <p className="text-sm">Thank you for signing up!</p>
            ):(
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="Enter your email Address"
                        />
                    </div>
                    <button type="submit" className="button-submit">Submit</button>
                </form>
            )}
        </div>
    )
}
export default BookEvent