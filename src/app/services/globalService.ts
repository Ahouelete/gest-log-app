import { JwtHelperService } from '@auth0/angular-jwt';


// constantes
const jwt = new JwtHelperService()

//constantes
const colors = [
    {
        key: 'A',
        color: '#7d2ae7'
    },
    {
        key: 'B',
        color: ''
    },
    {
        key: 'C',
        color: ''
    },
    {
        key: 'D',
        color: ''
    },
    {
        key: 'E',
        color: ''
    },
    {
        key: 'F',
        color: ''
    },
    {
        key: 'G',
        color: ''
    },
    {
        key: 'H',
        color: '#9932CC'
    },
    {
        key: 'I',
        color: '#6B8E23'
    },
    {
        key: 'J',
        color: '#008080'
    },
    {
        key: 'K',
        color: '#708090'
    },
    {
        key: 'L',
        color: '#9932CC'
    },
    {
        key: 'M',
        color: '#4682B4'
    },
    {
        key: 'N',
        color: '#5F9EA0'
    },
    {
        key: 'O',
        color: '#483D8B'
    },
    {
        key: 'P',
        color: '#A0522D'
    },
    {
        key: 'Q',
        color: '#8A2BE2'
    },
    {
        key: 'R',
        color: '#483D8B'
    },
    {
        key: 'S',
        color: '#8FBC8F'
    },
    {
        key: 'T',
        color: '#556B2F'
    },
    {
        key: 'U',
        color: '#CD5C5C'
    },
    {
        key: 'V',
        color: '#FF6347'
    },
    {
        key: 'W',
        color: '#008080'
    },
    {
        key: 'Y',
        color: '#800080'
    },
    {
        key: 'Z',
        color: '#00FF00'
    }
]
//Controller
export class GlobalService {

    saveToken(token: any) {
        window.sessionStorage.removeItem('token')
        window.sessionStorage.setItem('token', token)
    }

    removeToken() {
        window.sessionStorage.removeItem('token')
    }

    getToken() {
        return window.sessionStorage.getItem('token')
    }

    getCurrentUser() {
        const token = window.sessionStorage.getItem('token')
        if (token) {
            const user = jwt.decodeToken(token)
            return user
        }
        return null
    }

    getColor() {

    }
}