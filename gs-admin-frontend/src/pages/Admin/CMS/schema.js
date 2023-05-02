import * as Yup from 'yup'

export const createCmsSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required'),
  slug: Yup.string()
    .required('Slug is required')
    .min(3, 'Slug must be at least 3 characters')
    .max(30, 'Slug must be at most 30 characters')
    .matches(/^[a-z0-9]+(?:[_-][a-z0-9]+)*$/, 'Enter a valid url slug')
})

export const createCmsNewSchema = Yup.object().shape({
  slug: Yup.string()
    .required('Slug is required')
    .min(3, 'Slug must be at least 3 characters')
    .max(30, 'Slug must be at most 30 characters')
    .matches(/^[a-z0-9]+(?:[_-][a-z0-9]+)*$/, 'Enter a valid url slug')
})