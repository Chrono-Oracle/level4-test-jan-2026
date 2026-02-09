const { z } = require('zod');
const Validation = require('./index');

const userValidation = (req,  res, next) => {

    const schema = z.object({
        first_name: z.string().min(3, "First name must be at least 3 characters long"),
        last_name: z.string().min(3, "Last name must be at least 3 characters long"),
        category: z.enum(['Admin', 'Teacher', 'Student'], {
            errorMap: () => ({ message: "Category must be Admin, Teacher, or Student" })
        })
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
        phone: z.string().min(9),
        email: z.email().optional().or(z.literal('')),
        addedBy: z.string().min(3, "Whose adding this contact?")
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