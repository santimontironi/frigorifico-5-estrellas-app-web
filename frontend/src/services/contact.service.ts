import api from './api'
import type { ContactData } from '../types/general.types'

export const sendContactEmailService = (contactData: ContactData) => {
    return api.post('/contact', contactData)
}