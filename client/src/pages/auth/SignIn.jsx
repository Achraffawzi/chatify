import { yupResolver } from '@hookform/resolvers/yup';
import {
	Button,
	Checkbox,
	Group,
	PasswordInput,
	Text,
	TextInput,
} from '@mantine/core';

import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
	email: yup.string().email().required('Email address is required'),
	password: yup.string().required('Password is required'),
	rememberMe: yup.bool(),
});

function SignIn() {
	const methods = useForm({
		resolver: yupResolver(validationSchema),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = methods;

	const onSubmit = (e) => {
		console.log(e);
	};

	return (
		<>
			<Text size='lg' weight={500} align='center' mb='xl'>
				Sign in
			</Text>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextInput
					id='email'
					name='email'
					label='Email address'
					type='email'
					mb='lg'
					withAsterisk
					error={errors.email && errors.email.message}
					{...register('email')}
				/>
				<PasswordInput
					label='Password'
					withAsterisk
					error={errors.email && errors.email.message}
					{...register('password')}
				/>

				<Group position='apart' my='xl'>
					<Checkbox
						label='Remember me'
						name='rememberMe'
						{...register('rememberMe')}
					/>
					<Text
						component={Link}
						size='sm'
						color='blue'
						to='/auth/forget-password'>
						Forgot password
					</Text>
				</Group>
				<Button type='submit' fullWidth>
					Sign in
				</Button>
				<Text mt='lg' align='center' size='sm'>
					Don't have an account? <Link to='/auth/signup'>Sign up</Link>
				</Text>
			</form>
		</>
	);
}

export default SignIn;
