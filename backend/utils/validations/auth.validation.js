const { z } = require('zod');
const Validation = require('./index');

const userValidation = (req,  res, next) => {

    const schema = z.object({
        first_name: z.string().min(3),
        last_name: z.string().min(3)
    })

    const valid = Validation(schema, req.body);
    if (valid.isValid) {
        req.body = valid.data;
        next();
    } else {
        console.log("Validation errors:", valid.error);
        return res.status(400).json(valid.error);
    }
}

const contactValidation = ( req, res, next ) => {

    const schema = z.object({
        fullname: z.string().min(5),
        phone: z.number().positive(),
        email: z.email()
    })

    const valid = Validation(schema, req.body);
    if (valid.isValid) {
        req.body = valid.data;
        next();
    } else {
        console.log("Validation errors:", valid.error);
        return res.status(400).json(valid.error);
    }

}

module.exports = { userValidation, contactValidation }