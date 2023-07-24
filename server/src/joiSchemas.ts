import Joi from 'joi'
// import sanitizeHtml from 'sanitize-html'

// const extension = (joi) => ({
//     type: 'string',
//     base: joi.string(),
//     messages: {
//         'string.escapeHTML': '{{#label}} must not include HTML!'
//     },
//     rules: {
//         escapeHTML: {
//             validate(value, helpers) {
//                 const clean = sanitizeHtml(value, {
//                     allowedTags: [],
//                     allowedAttributes: {},
//                 })
//                 if (clean !== value) return helpers.error('string.escapeHTML', { value })
//                 return clean
//             }
//         }
//     }
// })

// const Joi = BaseJoi.extend(extension)

export const authSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})
export const userSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})
export const invoiceSchema = Joi.object({
    user: Joi.string().required(),
    billFrom: Joi.object({
        streetAddress: Joi.string().required(),
        city: Joi.string().required(),
        postCode: Joi.string().required(),
        country: Joi.string().required(),
    }).required(),
    billTo: Joi.object({
        clientName: Joi.string().required(),
        clientEmail: Joi.string().required(),
        streetAddress: Joi.string().required(),
        city: Joi.string().required(),
        postCode: Joi.string().required(),
        country: Joi.string().required(),
    }).required(),
    date: Joi.date().required(),
    description: Joi.string().required(),
    status: Joi.string().required(),
    paymentTerms: Joi.string().required(),
    items: Joi.array().items({
        _id: Joi.string(),
        id: Joi.string().required(),
        name: Joi.string().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
    }).required(),
})