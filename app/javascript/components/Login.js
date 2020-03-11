import { Button, Container, TextField, Typography } from '@material-ui/core';
import { navigate } from '@reach/router';
import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';

const Login = (props) => {
    const [ errors, setErrors ] = useState([]);

    const handleSubmit = (values) => {
        const postUserDetails = async () => {
            const csrfToken = document.querySelector('meta[name=csrf-token]').content;
            const response = await fetch('/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/vnd.api+json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ user: values })
            });
            const data = await response.json();
            if (data.logged_in) {
                props.handleLogin(data);
                setErrors([]);
                navigate('/admin_actions');
            } else {
                setErrors(data.errors);
            }
        };
        postUserDetails();
    };

    const hasError = () => errors.length !== 0;

    return (
        <Container>
            <Typography variant='h2'>Admin Login</Typography>
            <Formik
                initialValues={{
                    username: '',
                    password: ''
                }}
                onSubmit={handleSubmit}
            >
                <Form>
                    <Field
                        as={TextField}
                        type='text'
                        name='username'
                        label='Username'
                        required
                        error={hasError()}
                        helperText={errors[0]}
                        variant='outlined'
                        margin='normal'
                    />
                    <br />
                    <Field
                        as={TextField}
                        type='password'
                        name='password'
                        label='Password'
                        required
                        error={hasError()}
                        helperText={errors[0]}
                        variant='outlined'
                        margin='normal'
                    />
                    <br />

                    <Button type='submit' variant='contained' color='primary'>
                        Login
                    </Button>
                </Form>
            </Formik>
        </Container>
    );
};

export default Login;
