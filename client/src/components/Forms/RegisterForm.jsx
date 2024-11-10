import { useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'

const RegisterForm = () => {
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [registerError, setRegisterError] = useState("");

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        setRegisterError("");
    }

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        if (registerData.password !== registerData.confirmPassword) {
            setRegisterError("密碼不一致");
            return;
        }
        console.log('註冊完成');
    }

    return (
        <Card style={{ borderRadius: '15px', background: 'dimgray', color: 'white' }}>
            <Card.Body className="p-5">
                <h2 className="text-uppercase text-center mb-5">Create an account</h2>
                <Form onSubmit={handleRegisterSubmit}>
                    {/* Name Column */}
                    <Form.Group className="mb-4" controlId="formName">
                        <Form.Label>Your Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            size="lg" 
                            name="name"
                            onChange={handleRegisterChange} 
                            value={registerData.name}
                            required
                        />
                    </Form.Group>
                    {/* Email Column */}
                    <Form.Group className="mb-4" controlId="formEmail">
                        <Form.Label>Your Email</Form.Label>
                        <Form.Control 
                            type="email" 
                            size="lg" 
                            name="email"
                            onChange={handleRegisterChange} 
                            value={registerData.email}
                            required
                        />
                    </Form.Group>
                    {/* Password Column */}
                    <Form.Group className="mb-4" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            size="lg" 
                            name="password"
                            onChange={handleRegisterChange} 
                            value={registerData.password} 
                            required
                        />
                    </Form.Group>
                    {/* Confirm Password Column */}
                    <Form.Group className="mb-4" controlId="formConfirmPassword">
                        <Form.Label>Confirm your password</Form.Label>
                        <Form.Control 
                            type="password" 
                            size="lg" 
                            name="confirmPassword"
                            onChange={handleRegisterChange} 
                            value={registerData.confirmPassword} 
                            required
                        />
                    </Form.Group>
                    {/* registerError Message */}
                    {registerError && <Alert variant="danger">{registerError}</Alert>}

                    <div className="d-flex justify-content-center">
                        <Button
                            type="submit"
                            variant="success"
                            size="lg"
                            className="btn-block gradient-custom-4 text-body"
                        >
                            Sign Up
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default RegisterForm