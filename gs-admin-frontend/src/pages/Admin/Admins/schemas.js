import * as Yup from 'yup'

export const createSAdminUserSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .max(200)
    .required('Email Required'),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Invalid Password'
    )
    .max(50)
    .required('Password Required'),
  firstName: Yup.string().min(3, 'First Name must be atleast 3 characters')
    .max(200)
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)?$/, 'Only Alphabets and Space Allowed and Must Start with Alphabet')
    .required('First Name Required'),
  lastName: Yup.string().min(3, 'Last Name must be atleast 3 characters')
    .max(200)
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)?$/, 'Only Alphabets and Space Allowed and Must Start with Alphabet')
    .required('Last Name Required'),
  role: Yup.string().required('Role Required').nullable(),
  adminId: Yup.string().when('role', {
    is: (role) => role === 'Support',
    then: Yup.string().required('Parent Manager is required').nullable(),
    otherwise: Yup.string().nullable()
  }),
  superAdminUsername: Yup.string()
    .matches(/^[A-Za-z]+$/, 'Only Alphabets Allowed')
    .min(8, 'User Name must be atleast 8 characters')
    .max(100)
    .required('User Name Required'),
  group: Yup.string().min(3, 'Group Name must be atleast 3 characters')
    .max(200)
    .matches(/^[A-Za-z0-9 ]+$/, 'Only Alphabets, Numbers and Space Allowed')
    .required('Group Name Required')
})

export const updateSAdminUserSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .max(200)
    .required('Email Required'),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Invalid Password'
    )
    .max(50),
  firstName: Yup.string().min(3, 'First Name must be atleast 3 characters')
    .max(200)
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)?$/, 'Only Alphabets and Space Allowed and Must Start with Alphabet')
    .required('First Name Required'),
  lastName: Yup.string().min(3, 'Last Name must be atleast 3 characters')
    .max(200)
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)?$/, 'Only Alphabets and Space Allowed and Must Start with Alphabet')
    .required('Last Name Required'),
  role: Yup.string().required('Role Required').nullable(),
  adminId: Yup.string().when('role', {
    is: (role) => role === 'Support',
    then: Yup.string().required('Parent Admin is required').nullable(),
    otherwise: Yup.string().nullable()
  }),
  superAdminUsername: Yup.string()
    .matches(/^[a-zA-Z][a-zA-Z0-9_]+$/, 'Must Start with Alphabet.Only Alphabets, Numbers and UnderScore(_) allowed')
    .min(3, 'Minimum 3 characters required')
    .max(100)
    .required('User Name Required'),
  group: Yup.string().min(3, 'Group Name must be atleast 3 characters')
    .max(200)
    .matches(/^[A-Za-z0-9 ]+$/, 'Only Alphabets, Numbers and Space Allowed')
    .required('Group Name Required').nullable()
})
