import Axios from 'axios'

const axios = Axios.create({
    baseURL:'http://localhost:3005',
    headers: {
        'x-auth':localStorage.getItem('x-auth')
    }
})

export default axios